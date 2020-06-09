import { createAction, handleAction } from 'redux-actions'
import {
    EditorState,
    Path,
    View,
    Vector,
    Size,
    Component,
    ID,
    Kit,
    InputConfig,
} from './types'
import {
    initialData,
    pathToString,
    viewPathToString,
    ensureMould,
    findMould,
    getDefaultMouldName,
    deleteMould,
    getDefaultStateName,
} from './utils'
import nanoid from 'nanoid'
import { remove, find, cloneDeep } from 'lodash'

type SelectComponentAction = { pathes: Path[] }
const SELECT_COMPONENT = 'SELECT_COMPONENT'
export const selectComponent = createAction<SelectComponentAction>(
    SELECT_COMPONENT
)
export const handleSelectComponent = handleAction<
    EditorState,
    SelectComponentAction
>(
    SELECT_COMPONENT,
    (state, { payload: { pathes } }) => {
        if (pathes.length === 0) {
            state.selection = undefined
        } else if (!state.selection) {
            state.selection = pathes[0]
        } else if (
            viewPathToString(pathes[0]) !== viewPathToString(state.selection)
        ) {
            state.selection = pathes[0]
        } else {
            const index = pathes.findIndex(
                (p) => pathToString(p) === pathToString(state.selection!)
            )
            if (index === -1) {
                const selectionStr = pathToString(state.selection)

                for (let path of pathes.reverse()) {
                    const pathStr = pathToString(path)
                    if (
                        selectionStr.includes(pathStr) ||
                        pathStr.slice(0, pathStr.length - 1) ===
                            selectionStr.slice(0, selectionStr.length - 1)
                    ) {
                        state.selection = path
                        break
                    }
                }
            } else {
                const nextSelection = pathes[index + 1]
                if (nextSelection) {
                    state.selection = nextSelection
                }
            }
        }

        return state
    },
    initialData
)

type SelectComponentFromTreeAction = { path: Path | undefined }
const SELECT_COMPONENT_FROM_TREE = 'SELECT_COMPONENT_FROM_TREE'
export const selectComponentFromTree = createAction<
    SelectComponentFromTreeAction
>(SELECT_COMPONENT_FROM_TREE)
export const handleSelectComponentFromTree = handleAction<
    EditorState,
    SelectComponentFromTreeAction
>(
    SELECT_COMPONENT_FROM_TREE,
    (state, { payload: { path } }) => {
        state.selection = path

        return state
    },
    initialData
)

type AddInputAction = {
    mouldName: string
    inputKey: string
    config: InputConfig
}
const ADD_INPUT = 'ADD_INPUT'
export const addInput = createAction<AddInputAction>(ADD_INPUT)
export const handleAddInput = handleAction<EditorState, AddInputAction>(
    ADD_INPUT,
    (state, action) => {
        const mould = ensureMould(state, action.payload.mouldName)
        if (!mould.input) {
            mould.input = {}
        }
        mould.input[action.payload.inputKey] = action.payload.config

        return state
    },
    initialData
)

type RemoveInputAction = { mouldName: string; inputKey: string }
const REMOVE_INPUT = 'REMOTE_INPUT'
export const removeInput = createAction<RemoveInputAction>(REMOVE_INPUT)
export const handleRemoveInput = handleAction<EditorState, RemoveInputAction>(
    REMOVE_INPUT,
    (state = initialData, action) => {
        const mould = ensureMould(state, action.payload.mouldName)
        mould.input[action.payload.inputKey] = undefined
        delete mould.input[action.payload.inputKey]

        return state
    },
    initialData
)

type ModifyScopeAction = {
    mouldName: string
    scope: string[]
}
const MODIFY_SCOPE = 'MODIFY_SCOPE'
export const modifyScope = createAction<ModifyScopeAction>(MODIFY_SCOPE)
export const handleModifyScope = handleAction<EditorState, ModifyScopeAction>(
    MODIFY_SCOPE,
    (state, action) => {
        ensureMould(state, action.payload.mouldName).scope =
            action.payload.scope

        return state
    },
    initialData
)

type DeleteScopeAction = {
    mouldName: string
    scopeName: string
}
const DELETE_SCOPE = 'DELETE_SCOPE'
export const deleteScope = createAction<DeleteScopeAction>(DELETE_SCOPE)
export const handleDeleteScope = handleAction<EditorState, DeleteScopeAction>(
    DELETE_SCOPE,
    (state, { payload: { mouldName, scopeName } }) => {
        const mould = ensureMould(state, mouldName)
        mould.scope = mould.scope.filter((name) => name !== scopeName)

        const kits = mould.kits.filter((k) =>
            k.dataMappingVector.flat().includes(scopeName)
        )
        kits.forEach((kit) => {
            Object.assign(kit, {
                dataMappingVector: kit.dataMappingVector.filter(
                    ([, target]) => target !== scopeName
                ),
            })
        })

        return state
    },
    initialData
)

type AddScopeAction = {
    mouldName: string
    scope: string
}
const ADD_SCOPE = 'ADD_SCOPE'
export const addScope = createAction<AddScopeAction>(ADD_SCOPE)
export const handleAddScope = handleAction<EditorState, AddScopeAction>(
    ADD_SCOPE,
    (state, action) => {
        const mould = ensureMould(state, action.payload.mouldName)
        mould.scope.push(action.payload.scope)

        return state
    },
    initialData
)

type RemoveScopeAction = {
    mouldName: string
    scope: string
}
const REMOVE_SCOPE = 'REMOVE_SCOPE'
export const removeScope = createAction<RemoveScopeAction>(REMOVE_SCOPE)
export const handleRemoveScope = handleAction<EditorState, RemoveScopeAction>(
    REMOVE_SCOPE,
    (state, action) => {
        const mould = ensureMould(state, action.payload.mouldName)
        const index = mould.scope.findIndex(
            (value) => value === action.payload.scope
        )
        if (index !== -1) {
            mould.scope.splice(index, 1)
        }

        return state
    },
    initialData
)

type AddStateAction = {
    mouldName: string
    state: string
}
const ADD_STATE = 'ADD_STATE'
export const addState = createAction<AddStateAction>(ADD_STATE)
export const handleAddState = handleAction<EditorState, AddStateAction>(
    ADD_STATE,
    (state, action) => {
        ensureMould(state, action.payload.mouldName).states[
            action.payload.state
        ] = null
        const view: View = {
            id: nanoid(6),
            mouldName: action.payload.mouldName,
            state: action.payload.state,
            width: 300,
            height: 500,
            x: 100,
            y: 100,
        }
        state.views[view.id] = view

        return state
    },
    initialData
)

type RemoveStateAction = {
    mouldName: string
    state: string
}
const REMOVE_STATE = 'REMOVE_STATE'
export const removeState = createAction<RemoveStateAction>(REMOVE_STATE)
export const handleRemoveState = handleAction<EditorState, RemoveStateAction>(
    REMOVE_STATE,
    (state, action) => {
        const viewId = (<any>Object)
            .values(state.views)
            .find((g) => g.mouldName === action.payload.mouldName).id

        delete ensureMould(state, action.payload.mouldName).states[
            action.payload.state
        ]
        delete state.views[viewId]

        return state
    },
    initialData
)

type ResizeViewAction = {
    viewId: string
} & Size
const RESIZE_VIEW = 'RESIZE_VIEW'
export const resizeView = createAction<ResizeViewAction>(RESIZE_VIEW)
export const handleResizeView = handleAction<EditorState, ResizeViewAction>(
    RESIZE_VIEW,
    (state, action) => {
        const view = state.views[action.payload.viewId]
        view.width = action.payload.width
        view.height = action.payload.height

        return state
    },
    initialData
)

type ModifyMouldTreeAction = {
    mouldName: string
    tree: Component
    state: string
}
const MODIFY_MOULD_TREE = 'MODIFY_MOULD_TREE'
export const modifyMouldTree = createAction<ModifyMouldTreeAction>(
    MODIFY_MOULD_TREE
)
export const handleModifyMouldTree = handleAction<
    EditorState,
    ModifyMouldTreeAction
>(
    MODIFY_MOULD_TREE,
    (state, action) => {
        const mould = ensureMould(state, action.payload.mouldName)
        mould.states[action.payload.state] = action.payload.tree

        return state
    },
    initialData
)

type WaitingForCreatingAction = {
    mouldName?: string
    injectedKitName?: string
}
const WAITING_FOR_CREATING = 'WAITING_FOR_CREATING'
export const waitingForCreating = createAction<WaitingForCreatingAction>(
    WAITING_FOR_CREATING
)
export const handleWaitingForCreating = handleAction<
    EditorState,
    WaitingForCreatingAction
>(
    WAITING_FOR_CREATING,
    (state, { payload: { mouldName, injectedKitName } }) => {
        state.creating = {
            status: 'waiting',
            view: {
                id: nanoid(6),
                mouldName: mouldName || getDefaultMouldName(state),
                state: mouldName
                    ? getDefaultStateName(ensureMould(state, mouldName))
                    : 'state0',
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            beginAt: { x: 0, y: 0 },
            injectedKitName,
        }

        return state
    },
    initialData
)

type StartCreatingAction = Vector
const START_CREATING = 'START_CREATING'
export const startCreating = createAction<StartCreatingAction>(START_CREATING)
export const handleStartCreating = handleAction<
    EditorState,
    StartCreatingAction
>(
    START_CREATING,
    (state, { payload: { x, y } }) => {
        if (state.creating && state.creating.status === 'waiting') {
            state.creating.status = 'start'
            state.creating.beginAt = { x, y }
        }

        return state
    },
    initialData
)

type UpdateCreatingAction = Vector
const UPDATE_CREATING = 'UPDATE_CREATING'
export const updateCreating = createAction<UpdateCreatingAction>(
    UPDATE_CREATING
)
export const handleUpdateCreating = handleAction<
    EditorState,
    UpdateCreatingAction
>(
    UPDATE_CREATING,
    (state, { payload: { x, y } }) => {
        if (
            state.creating &&
            (state.creating.status === 'start' ||
                state.creating.status === 'updating')
        ) {
            state.creating.status = 'updating'

            state.creating.view.width = Math.abs(x - state.creating.beginAt.x)
            state.creating.view.height = Math.abs(y - state.creating.beginAt.y)
            state.creating.view.x = Math.min(x, state.creating.beginAt.x)
            state.creating.view.y = Math.min(y, state.creating.beginAt.y)
        }

        return state
    },
    initialData
)

type FinishCreatingAction = void
const FINISH_CREATING = 'FINISH_CREATING'
export const finishCreating = createAction<FinishCreatingAction>(
    FINISH_CREATING
)
export const handleFinishCreating = handleAction<
    EditorState,
    FinishCreatingAction
>(
    FINISH_CREATING,
    (state) => {
        const { status, view, injectedKitName } = state.creating || {}
        if (
            status === 'updating' &&
            typeof view === 'object' &&
            view.width !== 0 &&
            view.height !== 0
        ) {
            state.views[view.id] = view
            state.testWorkspace.views = [...state.testWorkspace.views, view.id]
            let mould = findMould(state, view.mouldName)
            if (!mould) {
                mould = {
                    name: view.mouldName,
                    scope: [],
                    kits: [],
                    input: {},
                    states: {},
                }
                state.moulds.push(mould)
            }
            mould.states[view.state] = injectedKitName
                ? { type: injectedKitName, props: {} }
                : null
        }

        state.creating = undefined
        delete state.creating

        return state
    },
    initialData
)

type CancelCreatingAction = void
const CANCEL_CREATING = 'CANCEL_CREATING'
export const cancelCreating = createAction<CancelCreatingAction>(
    CANCEL_CREATING
)
export const handleCancelCreating = handleAction<
    EditorState,
    CancelCreatingAction
>(
    CANCEL_CREATING,
    (state) => {
        state.creating = undefined
        delete state.creating

        return state
    },
    initialData
)

type DragViewAction = { id: string; x: number; y: number }
const DRAG_VIEW = 'DRAG_VIEW'
export const dragView = createAction<DragViewAction>(DRAG_VIEW)
export const handleDragView = handleAction<EditorState, DragViewAction>(
    DRAG_VIEW,
    (state, { payload: { id, x, y } }) => {
        state.views[id].x = x
        state.views[id].y = y

        return state
    },
    initialData
)

type SortTreeAction = { info: any }
const SORT_TREE = 'SORT_TREE'
export const sortTree = createAction<SortTreeAction>(SORT_TREE)
export const handleSortTree = handleAction<EditorState, SortTreeAction>(
    SORT_TREE,
    (state, { payload: { info } }) => {
        const selection = state.selection

        const selectedTree =
            selection &&
            ensureMould(state, selection[0][0]).states[selection[0][1]]

        if (selectedTree && selection) {
            let dropKey = info.node.props.eventKey
            const dragKey = info.dragNode.props.eventKey
            const dropPos = info.node.props.pos.split('-')
            const dropPosition =
                info.dropPosition - Number(dropPos[dropPos.length - 1])

            const loop = (data, key, addPath, callback) => {
                const target = Array.isArray(data) ? data : data.children
                target.forEach((item, index, arr) => {
                    const path = addPath ? `${addPath}-${index}` : `${index}`
                    if (path === key) {
                        callback(item, index, arr)
                        return
                    }
                    if (item.children) {
                        loop(item.children, key, path, callback)
                    }
                })
            }
            const data = selectedTree

            // Find dragObject
            let dragObj
            loop(data, dragKey, '', (item, index, arr) => {
                arr.splice(index, 1)
                dragObj = item
            })

            const l = dragKey.length - 1
            if (parseInt(dragKey[l]) < parseInt(dropKey[l])) {
                const prevStr = dragKey.substring(0, l)
                if (prevStr === dropKey.substring(0, l)) {
                    dropKey =
                        prevStr +
                        (parseInt(dropKey[l]) - 1) +
                        dropKey.substring(l + 1)
                }
            }

            if (!info.dropToGap) {
                // Drop on the content
                loop(data, dropKey, '', (item) => {
                    item.children = item.children || []
                    // where to insert 示例添加到尾部，可以是随意位置
                    const index = item.children.push(dragObj)
                })
            } else if (
                (info.node.props.children || []).length > 0 && // Has children
                info.node.props.expanded && // Is expanded
                dropPosition === 1 // On the bottom gap
            ) {
                loop(data, dropKey, '', (item) => {
                    item.children = item.children || []
                    // where to insert 示例添加到尾部，可以是随意位置
                    item.children.unshift(dragObj)
                })
            } else {
                // Drop on the gap
                let ar
                let i
                loop(data, dropKey, '', (item, index, arr) => {
                    ar = arr
                    i = index
                })
                if (dropPosition === -1) {
                    ar.splice(i, 0, dragObj)
                } else {
                    ar.splice(i + 1, 0, dragObj)
                }
            }

            ensureMould(state, selection[0][0]).states[selection[0][1]] = data
            selection[1] = []
        }

        return state
    },
    initialData
)

type HasChildren = {
    children?: HasChildren[]
}

const deleteChildren = (comp: HasChildren, path: number[]) => {
    if (path.length === 1) {
        comp.children!.splice(path[0], 1)
    } else {
        deleteChildren(comp.children![path[0]], path.slice(1))
    }
}

type DeleteNodeAction = void
const DELETE_NODE = 'DELETE_NODE'
export const deleteNode = createAction<DeleteNodeAction>(DELETE_NODE)
export const handleDeleteNode = handleAction<EditorState, DeleteNodeAction>(
    DELETE_NODE,
    (state) => {
        const selection = state.selection
        const views = state.views
        const allViews = Object.keys(views)
        if (state.testWorkspace.views.length !== allViews.length) {
            state.testWorkspace.views = allViews
        }

        if (selection) {
            if (selection[1].length) {
                deleteChildren(
                    {
                        children: ensureMould(state, selection[0][0]).states[
                            selection[0][1]
                        ]?.children,
                    },
                    selection[1]
                )
                selection[1] = []
            } else {
                if (
                    ensureMould(state, selection[0][0]).states[
                        selection[0][1]
                    ] !== null
                ) {
                    ensureMould(state, selection[0][0]).states[
                        selection[0][1]
                    ] = null
                } else {
                    delete ensureMould(state, selection[0][0]).states[
                        selection[0][1]
                    ]
                    if (
                        Object.keys(ensureMould(state, selection[0][0]).states)
                            .length === 0
                    ) {
                        deleteMould(state, selection[0][0])
                    }
                    const view = Object.values(state.views).find(
                        (view) =>
                            view.mouldName === selection[0][0] &&
                            view.state === selection[0][1]
                    )
                    delete state.views[view!.id]
                    const index = state.testWorkspace.views.findIndex(
                        (viewId) => view!.id === viewId
                    )
                    state.testWorkspace.views.splice(index, 1)
                    state.selection = undefined
                }
            }
        }

        return state
    },
    initialData
)

type AddKitAction = {
    type: string
    mouldName: string
    name?: string
    param?: object
}
const ADD_KIT = 'ADD_KIT'
export const addKit = createAction<AddKitAction>(ADD_KIT)
export const handleAddKit = handleAction<EditorState, AddKitAction>(
    ADD_KIT,
    (state, { payload: { type, mouldName, name, param } }) => {
        const mould = ensureMould(state, mouldName)
        const { kits } = mould

        let kitName = name || `kit ${kits.length}`
        const names = kits.map((k) => k.name)
        if (names.includes(kitName)) {
            kitName = 'New-' + kitName
        }

        const kit: Kit = {
            type,
            name: kitName,
            dataMappingVector: [],
            param,
        }

        kits.push(kit)

        return state
    },
    initialData
)

type ConnectScopeToKit = {
    scope: string
    prop: string
    mouldName: string
    kitIndex: number
}
const CONNECT_SCOPE_TO_KIT = 'CONNECT_SCOPE_TO_KIT'
export const connectScopeToKit = createAction<ConnectScopeToKit>(
    CONNECT_SCOPE_TO_KIT
)
export const handleConnectScopeToKit = handleAction<
    EditorState,
    ConnectScopeToKit
>(
    CONNECT_SCOPE_TO_KIT,
    (state, { payload: { scope, prop, mouldName, kitIndex } }) => {
        const mould = ensureMould(state, mouldName)
        const kit = mould.kits[kitIndex]
        kit.dataMappingVector.push([prop, scope])

        return state
    },
    initialData
)

type DisConnectScopeToKit = {
    scope: string
    prop: string
    mouldName: string
    kitName: string
}
const DISCONNECT_SCOPE_TO_KIT = 'DISCONNECT_SCOPE_TO_KIT'
export const disconnectScopeToKit = createAction<DisConnectScopeToKit>(
    DISCONNECT_SCOPE_TO_KIT
)
export const handleDisConnectScopeToKit = handleAction<
    EditorState,
    DisConnectScopeToKit
>(
    DISCONNECT_SCOPE_TO_KIT,
    (state, { payload: { scope, prop, mouldName, kitName } }) => {
        const mould = ensureMould(state, mouldName)
        const kit = find(mould.kits, (k) => k.name === kitName)

        remove(kit.dataMappingVector, (v) => v[0] === prop && v[1] === scope)
        return state
    },
    initialData
)

type ModifyInputAction = {
    mouldName: string
    inputKey: string
    config: InputConfig
}
const MODIFY_INPUT = 'MODIFY_INPUT'
export const modifyInput = createAction<ModifyInputAction>(MODIFY_INPUT)
export const handleModifyInput = handleAction<EditorState, ModifyInputAction>(
    MODIFY_INPUT,
    (state, action) => {
        ensureMould(state, action.payload.mouldName).input[
            action.payload.inputKey
        ] = action.payload.config

        return state
    },
    initialData
)

type ModifyMetaAction = {
    mouldName: string
    name: string
}
const MODIFY_META = 'MOULD_META'
export const modifyMeta = createAction<ModifyMetaAction>(MODIFY_META)
export const handleModifyMeta = handleAction<EditorState, ModifyMetaAction>(
    MODIFY_META,
    (state, { payload: { mouldName, name } }) => {
        const mould = ensureMould(state, mouldName)
        mould.name = name
        const view = Object.values(state.views).find(
            (v) => v.mouldName === mouldName
        )!
        view.mouldName = name

        if (state.selection) {
            state.selection[0][0] = name
        }

        return state
    },
    initialData
)

type ModifyKitAction = {
    mouldName: string
    kitName: string
    [key: string]: any
}
const MODIFY_KIT = 'MODIFY_KIT'
export const modifyKit = createAction<ModifyKitAction>(MODIFY_KIT)
export const handleModifyKit = handleAction<EditorState, ModifyKitAction>(
    MODIFY_KIT,
    (state, { payload: { mouldName, kitName, ...rest } }) => {
        const kit = ensureMould(state, mouldName).kits.find(
            (k) => k.name === kitName
        )
        Object.assign(kit, rest)

        return state
    },
    initialData
)

type DragToViewAction = {
    tree: Component
    viewId: ID
}
const DRAG_TO_VIEW = 'DRAG_TO_VIEW'
export const dragToView = createAction<DragToViewAction>(DRAG_TO_VIEW)
export const handleDragToView = handleAction<EditorState, DragToViewAction>(
    DRAG_TO_VIEW,
    (state, { payload: { tree, viewId } }) => {
        const view = state.views[viewId]
        const stateName = view.state
        const mould = ensureMould(state, view.mouldName)
        mould.states[stateName] = tree
        state.selection = [[mould.name, stateName], []]

        return state
    },
    initialData
)

type ModifyStateName = {
    mouldName: string
    stateName: string
    name: string
}
const MODIFY_STATENAME = 'STATE_NAME'
export const modifyStateName = createAction<ModifyStateName>(MODIFY_STATENAME)
export const handleModifyStateName = handleAction<EditorState, ModifyStateName>(
    MODIFY_STATENAME,
    (state, { payload: { mouldName, stateName, name } }) => {
        const currentMould = ensureMould(state, mouldName)
        currentMould.states[name] = currentMould.states[stateName]
        delete currentMould.states[stateName]

        const view = Object.values(state.views).find(
            (view) => view.state === stateName
        )
        if (view) view.state = name

        return state
    },
    initialData
)

type ModifyKitNameAction = {
    mouldName: string
    kitName: string
    newKitName: string
    stateName: string
}
const MODIFY_KITNAME = 'MODIFY_KITNAME'
export const modifyKitName = createAction<ModifyKitNameAction>(MODIFY_KITNAME)
export const handleModifyKitName = handleAction<
    EditorState,
    ModifyKitNameAction
>(
    MODIFY_KITNAME,
    (state, { payload: { mouldName, kitName, newKitName, stateName } }) => {
        const { kits, states } = ensureMould(state, mouldName)
        const currentKit = kits.find((k) => k.name === kitName)
        const currentState = states[stateName]

        const recursiveUpdate = (children, propSet) => {
            const { key, oldValue, newValue } = propSet
            children.forEach((child) => {
                if (child.children && Array.isArray(child.children)) {
                    recursiveUpdate(child.children, propSet)
                }
                if (child.props[key] === oldValue) {
                    child.props[key] = newValue
                }
            })
        }

        if (currentState?.children) {
            recursiveUpdate(currentState.children, {
                key: '__kitName',
                oldValue: kitName,
                newValue: newKitName,
            })
        }

        Object.assign(currentKit, { name: newKitName })

        return state
    },
    initialData
)

type DeleteKitAction = {
    mouldName: string
    kitName: string
    stateName: string
}
const DELETE_KIT = 'DELETE_KIT'
export const deleteKit = createAction<DeleteKitAction>(DELETE_KIT)
export const handleDeleteKit = handleAction<EditorState, DeleteKitAction>(
    DELETE_KIT,
    (state, { payload: { mouldName, kitName, stateName } }) => {
        const { kits, states } = ensureMould(state, mouldName)
        const currentKitIndex = kits.findIndex((k) => k.name === kitName)
        const currentState = states[stateName]
        const recursiveRemove = (children, propSet) => {
            const { key, name } = propSet
            children.forEach((child, index) => {
                if (child.children && Array.isArray(child.children)) {
                    recursiveRemove(child.children, propSet)
                }
                if (child.props[key] === name) {
                    children.splice(index, 1)
                }
            })
        }

        Object.assign(ensureMould(state, mouldName), {
            kits: [
                ...kits.slice(0, currentKitIndex),
                ...kits.slice(currentKitIndex + 1),
            ],
        })

        if (currentState?.children) {
            recursiveRemove(currentState.children, {
                key: '__kitName',
                name: kitName,
            })
        }
        return state
    },
    initialData
)

type renderRecursiveMouldAction = { key: string }
const RENDER_RECURSIVE_MOULD = 'RENDER_RECURSIVE_MOULD'
export const renderRecursiveMould = createAction<renderRecursiveMouldAction>(
    RENDER_RECURSIVE_MOULD
)
export const handleRenderRecursiveMould = handleAction<
    EditorState,
    renderRecursiveMouldAction
>(
    RENDER_RECURSIVE_MOULD,
    (state, { payload: { key } }) => {
        if (!state.recursiveRendered) {
            state.recursiveRendered = []
        }
        if (!state.recursiveRendered.includes(key)) {
            state.recursiveRendered.push(key)
        }

        return state
    },
    initialData
)

type UpdateDraggingStatusAction = {
    isDragging: boolean
}
const UPDATE_DRAGGING_STATUS = 'UPDATE_DRAGGING_STATUS'
export const updateDraggingStatus = createAction<UpdateDraggingStatusAction>(
    UPDATE_DRAGGING_STATUS
)
export const handleUpdateDraggingStatus = handleAction<
    EditorState,
    UpdateDraggingStatusAction
>(
    UPDATE_DRAGGING_STATUS,
    (state, { payload: { isDragging } }) => {
        state.isDragging = isDragging

        return state
    },
    initialData
)

type ZoomWorkspaceActionType = { zoom: number }
export const ZOOM_WORKSPACE = 'ZOOM_WORKSPACE'
export const zoomWorkspace = createAction<ZoomWorkspaceActionType>(
    ZOOM_WORKSPACE
)
export const handleZoomWorkspace = handleAction<
    EditorState,
    ZoomWorkspaceActionType
>(
    ZOOM_WORKSPACE,
    (state, action) => {
        state.testWorkspace.zoom = action.payload.zoom

        return state
    },
    initialData
)

type InsertComponentOnPathAction = {
    component: Component
    path: Path
}
const INSERT_COMPONENT_ON_PATH = 'INSERT_COMPONENT_ON_PATH'
export const insertComponentOnPath = createAction<InsertComponentOnPathAction>(
    INSERT_COMPONENT_ON_PATH
)
export const handleInsertComponentOnPath = handleAction<
    EditorState,
    InsertComponentOnPathAction
>(
    INSERT_COMPONENT_ON_PATH,
    (state, { payload: { component, path } }) => {
        const [[mouldName, stateName], indexArr] = path
        const tree = ensureMould(state, mouldName).states[stateName]
        let parent = tree!
        indexArr.forEach((i) => {
            parent = parent.children![i]
        })
        if (!parent.children) {
            parent.children = []
        }
        parent.children.push(component)
        state.selection = path

        return state
    },
    initialData
)

type MoveWorkspaceActionType = Vector
export const MOVE_WORKSPACE = 'MOVE_WORKSPACE'
export const moveWorkspace = createAction<MoveWorkspaceActionType>(
    MOVE_WORKSPACE
)
export const handleMoveWorkspace = handleAction<
    EditorState,
    MoveWorkspaceActionType
>(
    MOVE_WORKSPACE,
    (state, action) => {
        state.testWorkspace.x = action.payload.x
        state.testWorkspace.y = action.payload.y

        return state
    },
    initialData
)

type DuplicateView = { viewId: string }
const DUPLICATE_VIEW = 'DUPLICATE_VIEW'
export const duplicateView = createAction<DuplicateView>(DUPLICATE_VIEW)
export const handleDuplicateView = handleAction<EditorState, DuplicateView>(
    DUPLICATE_VIEW,
    (state, { payload: { viewId } }) => {
        const targetView = state.views[viewId]
        const targetMould = findMould(state, targetView.mouldName)
        const targetState = targetMould?.states[targetView.state]

        const newStateName = `dup-${targetView.state}`
        const newViewId = nanoid(6)

        const newView = {
            id: newViewId,
            x: targetView.x + 50,
            y: targetView.y + 50,
            state: newStateName,
            mouldName: targetView.mouldName,
            width: targetView.width,
            height: targetView.height,
        }

        const newState = cloneDeep(targetState)

        if (targetMould) {
            targetMould.states[newStateName] = newState
            state.views[newViewId] = newView
            state.testWorkspace.views.push(newViewId)
            state.selection = [[targetView.mouldName, newStateName], []]
        }

        return state
    },
    initialData
)
