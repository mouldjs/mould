import produce, {
    Patch,
    applyPatches,
    enablePatches,
    produceWithPatches,
} from 'immer'
import { Reducer } from 'redux'

enablePatches()

export type Change = Patch[]

export interface UndoCompatibleState {
    _changes?: Change[]
    _inverseChanges?: Change[]
    _processingChanges?: Change[]
}

const UNDO_ACTION = 'UNDO_ACTION'
const REDO_ACTION = 'REDO_ACTION'
const RESET_ACTION = 'RESET_ACTION'

export const undo = () => ({ type: UNDO_ACTION })
export const redo = () => ({ type: REDO_ACTION })
export const reset = () => ({ type: RESET_ACTION })

export const undoable = (state: UndoCompatibleState) =>
    (state._inverseChanges || []).length
export const redoable = (state: UndoCompatibleState) =>
    (state._processingChanges || []).length
export const resetable = (state: UndoCompatibleState) =>
    (state._inverseChanges || []).length

type UndoAction = {
    type: string
}

const flatArray = (target: Patch[][]): Patch[] => {
    const result = [] as Patch[]
    for (let i = 0; i < target.length; i++) {
        for (let j = 0; j < target[i].length; j++) {
            result.push(target[i][j])
        }
    }
    return result
}

let lastTimeOpenedPatch = 0

const undoReducer = (state: UndoCompatibleState, action: UndoAction) => {
    switch (action.type) {
        case 'UNDO_ACTION':
            if (undoable(state)) {
                lastTimeOpenedPatch = 0
                let { _inverseChanges = [], _processingChanges = [] } = state
                let [patches, ...rest] = _inverseChanges
                _processingChanges = [patches, ..._processingChanges]

                return produce(applyPatches(state, patches), (draft) => {
                    draft._inverseChanges = rest
                    draft._processingChanges = _processingChanges
                })
            }
            return false
        case 'REDO_ACTION':
            if (redoable(state)) {
                lastTimeOpenedPatch = 0
                let {
                    _changes = [],
                    _inverseChanges = [],
                    _processingChanges = [],
                } = state
                const patches = _changes[_processingChanges.length - 1]

                return produce(applyPatches(state, patches), (draft) => {
                    const [inverseChange, ...rest] = draft._processingChanges
                    draft._inverseChanges = [inverseChange, ..._inverseChanges]
                    draft._processingChanges = rest
                })
            }
            return false
        case 'RESET_ACTION':
            if (undoable(state)) {
                lastTimeOpenedPatch = 0
                let { _inverseChanges = [] } = state
                const patches = flatArray(_inverseChanges)

                return produce(applyPatches(state, patches), (draft) => {
                    draft._inverseChanges = []
                })
            }
    }
}

interface AnyAction {
    type: string
}

type Configs<State> = {
    actionFilter: (action: AnyAction) => boolean
    fieldFilter: (prev: State, next: State) => boolean
}

const defaultConfigs: Configs<any> = {
    actionFilter: () => true,
    fieldFilter: () => true,
}

const STACK_LIMIT_SIZE = 500
const WAIT = 500

export const createProcessReducers = <T>(
    configs: Configs<T> = defaultConfigs,
    cb?: (state: T) => void
) => <T>(...reducers: Reducer<T, any>[]) => {
    const { actionFilter, fieldFilter } = {
        ...defaultConfigs,
        ...configs,
    } as Configs<any>

    return (state: T & UndoCompatibleState, action: AnyAction) => {
        let res = undoReducer(state, action)
        if (res === false) {
            //dispatch 了 undo | redo 动作，但是当前不满足 undo | redo 条件，什么都不做原样返回

            return state
        }
        if (res === undefined) {
            //非 undo | redo

            const [nextState, patches, inversePatches] = produceWithPatches(
                state,
                (draft) => {
                    reducers.forEach((reducer) => {
                        reducer(draft as any, action)
                    })
                }
            )

            if (!patches.length) {
                return nextState
            }

            const isUndoPoint =
                actionFilter(action) &&
                fieldFilter(state, nextState) &&
                Date.now() - lastTimeOpenedPatch > WAIT

            const applyPatchData = produce(nextState, (draft) => {
                if (isUndoPoint) {
                    const changes = [
                        ...(draft._changes || []).slice(
                            (draft._processingChanges || []).length
                        ),
                    ]
                    const inverseChanges = [
                        ...((draft._inverseChanges || []) as Change[]),
                    ]
                    changes.unshift(patches)
                    inverseChanges.unshift(inversePatches)
                    draft._processingChanges = []
                    const deltaChangeLimitSize =
                        changes.length - STACK_LIMIT_SIZE
                    if (deltaChangeLimitSize > 0) {
                        changes.splice(STACK_LIMIT_SIZE, deltaChangeLimitSize)
                        inverseChanges.splice(
                            STACK_LIMIT_SIZE,
                            deltaChangeLimitSize
                        )
                    }
                    lastTimeOpenedPatch = Date.now()

                    draft._changes = changes
                    draft._inverseChanges = inverseChanges
                } else if (!draft._processingChanges?.length) {
                    const changes = draft._changes
                    const inverseChanges = draft._inverseChanges
                    changes &&
                        changes[0] &&
                        (changes[0] = [...changes[0], ...patches])
                    inverseChanges &&
                        inverseChanges[0] &&
                        (inverseChanges[0] = [
                            ...inversePatches,
                            ...inverseChanges[0],
                        ])

                    draft._changes = changes
                    draft._inverseChanges = inverseChanges
                }
            })

            res = applyPatchData as any
        }

        cb && cb(res as any)

        return res // undo | redo 的结果
    }
}
