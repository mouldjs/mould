import produce, { Patch, applyPatches } from 'immer'
import { Reducer } from 'redux'

export type Change = Patch[]

export interface UndoCompatibleState {
    _changes?: Change[]
    _inverseChanges?: Change[]
    _processingChanges?: Change[]
}

type ProduceWithPatches = <T>(
    data: T,
    mut: (draft: T) => any
) => [T, Patch[], Patch[]]

const produceWithPatches: ProduceWithPatches = (data, mut) => {
    let patches: Patch[] | undefined, inverses: Patch[] | undefined

    const nextData = produce(data, mut, (a, b) => {
        patches = a
        inverses = b
    })

    return [nextData, patches as Patch[], inverses as Patch[]]
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

const undoReducer = (state: UndoCompatibleState, action: UndoAction) => {
    switch (action.type) {
        case 'UNDO_ACTION':
            if (undoable(state)) {
                let { _inverseChanges = [], _processingChanges = [] } = state
                const patches = _inverseChanges.shift() as Change
                _processingChanges = [patches, ..._processingChanges]

                return produce(applyPatches(state, patches), draft => {
                    draft._inverseChanges = _inverseChanges
                    draft._processingChanges = _processingChanges
                })
            }
            return false
        case 'REDO_ACTION':
            if (redoable(state)) {
                let {
                    _changes = [],
                    _inverseChanges = [],
                    _processingChanges = [],
                } = state
                const patches = _changes[_processingChanges.length - 1]
                // _inverseChanges =

                return produce(applyPatches(state, patches), draft => {
                    const inverseChange = (draft._processingChanges as Change[]).shift() as Change
                    draft._inverseChanges = [inverseChange, ..._inverseChanges]
                })
            }
            return false
        case 'RESET_ACTION':
            if (undoable(state)) {
                let { _inverseChanges = [] } = state
                const patches = flatArray(_inverseChanges)

                return produce(applyPatches(state, patches), draft => {
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

            const isUndoPoint = actionFilter(action)

            const [nextState, patches, inversePatches] = produceWithPatches(
                state,
                draft => {
                    reducers.forEach(reducer => {
                        reducer(draft, action)
                    })
                }
            )

            if (!fieldFilter(state, nextState) || !patches.length) {
                return nextState
            }

            const applyPatchData = produce(nextState, draft => {
                const changes = [
                    ...(draft._changes || []).slice(
                        (draft._processingChanges || []).length
                    ),
                ]
                const inverseChanges = [
                    ...((draft._inverseChanges || []) as Change[]),
                ]

                if (isUndoPoint) {
                    changes.unshift(patches)
                    inverseChanges.unshift(inversePatches)
                    draft._processingChanges = []
                } else {
                    changes[0] && (changes[0] = [...changes[0], ...patches])
                    inverseChanges[0] &&
                        (inverseChanges[0] = [
                            ...inversePatches,
                            ...inverseChanges[0],
                        ])
                }

                draft._changes = changes
                draft._inverseChanges = inverseChanges
            })

            res = applyPatchData
        }

        cb && cb(res as any)

        return res // undo | redo 的结果
    }
}
