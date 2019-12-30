import { createAction, handleAction } from 'redux-actions'
import { EditorState, Path, View, Vector, Mould, Component } from './types'
import { initialData } from './utils'
import nanoid from 'nanoid'
import { Size } from 'mdlz-prmtz/dist/utils/geometry'

type SelectComponentAction = { selection: Path }
const SELECT_COMPONENT = 'SELECT_COMPONENT'
export const selectComponent = createAction(SELECT_COMPONENT)
export const handleSelectComponent = handleAction<
    EditorState,
    SelectComponentAction
>(
    SELECT_COMPONENT,
    (state, action) => {
        if (action.payload.selection === state.selection) {
            return
        }
        state.selection = action.payload.selection

        return state
    },
    initialData
)

type AddInputAction = { mouldId: string; inputKey: string }
const ADD_INPUT = 'ADD_INPUT'
export const addInput = createAction<AddInputAction>(ADD_INPUT)
export const handleAddInput = handleAction<EditorState, AddInputAction>(
    ADD_INPUT,
    (state, action) => {
        state.moulds[action.payload.mouldId].input[action.payload.inputKey] =
            'text'

        return state
    },
    initialData
)

type RemoveInputAction = { mouldId: string; inputKey: string }
const REMOVE_INPUT = 'REMOTE_INPUT'
export const removeInput = createAction<RemoveInputAction>(REMOVE_INPUT)
export const handleRemoveInput = handleAction<EditorState, RemoveInputAction>(
    REMOVE_INPUT,
    (state, action) => {
        state.moulds[action.payload.mouldId].input[
            action.payload.inputKey
        ] = undefined
        delete state.moulds[action.payload.mouldId].input[
            action.payload.inputKey
        ]

        return state
    },
    initialData
)

type ModifyInputDescriptionAction = {
    mouldId: string
    inputKey: string
    description: string
}
const MODIFY_INPUT_DESCRIPTION = 'MODIFY_INPUT_DESCRIPTION'
export const modifyInputDescription = createAction<
    ModifyInputDescriptionAction
>(MODIFY_INPUT_DESCRIPTION)
export const handleModifyInputDescription = handleAction<
    EditorState,
    ModifyInputDescriptionAction
>(
    MODIFY_INPUT_DESCRIPTION,
    (state, action) => {
        state.moulds[action.payload.mouldId].input[action.payload.inputKey] =
            action.payload.description

        return state
    },
    initialData
)

type AddScopeAction = {
    mouldId: string
    scope: string
}
const ADD_SCOPE = 'ADD_SCOPE'
export const addScope = createAction<AddScopeAction>(ADD_SCOPE)
export const handleAddScope = handleAction<EditorState, AddScopeAction>(
    ADD_SCOPE,
    (state, action) => {
        state.moulds[action.payload.mouldId].scope.push(action.payload.scope)

        return state
    },
    initialData
)

type RemoveScopeAction = {
    mouldId: string
    scope: string
}
const REMOVE_SCOPE = 'REMOVE_SCOPE'
export const removeScope = createAction<RemoveScopeAction>(REMOVE_SCOPE)
export const handleRemoveScope = handleAction<EditorState, RemoveScopeAction>(
    REMOVE_SCOPE,
    (state, action) => {
        const index = state.moulds[action.payload.mouldId].scope.findIndex(
            value => value === action.payload.scope
        )
        if (index !== -1) {
            state.moulds[action.payload.mouldId].scope.splice(index, 1)
        }

        return state
    },
    initialData
)

type AddStateAction = {
    mouldId: string
    state: string
}
const ADD_STATE = 'ADD_STATE'
export const addState = createAction<AddStateAction>(ADD_STATE)
export const handleAddState = handleAction<EditorState, AddStateAction>(
    ADD_STATE,
    (state, action) => {
        state.moulds[action.payload.mouldId].states[action.payload.state] = {
            type: 'Stack',
            props: {},
        }
        const view: View = {
            id: nanoid(6),
            mouldId: action.payload.mouldId,
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
    mouldId: string
    state: string
}
const REMOVE_STATE = 'REMOVE_STATE'
export const removeState = createAction<RemoveStateAction>(REMOVE_STATE)
export const handleRemoveState = handleAction<EditorState, RemoveStateAction>(
    REMOVE_STATE,
    (state, action) => {
        const viewId = Object.values(state.views).find(
            g => g.mouldId === action.payload.mouldId
        ).id

        state.moulds[action.payload.mouldId].states[
            action.payload.state
        ] = undefined
        delete state.moulds[action.payload.mouldId].states[action.payload.state]

        state.views[viewId] = undefined
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

type AddMouldAction = Size & Vector
const ADD_MOULD = 'ADD_MOULD'
export const addMould = createAction<AddMouldAction>(ADD_MOULD)
export const handleAddMould = handleAction<EditorState, AddMouldAction>(
    ADD_MOULD,
    (state, action) => {
        const { width, height, x, y } = action.payload
        const mouldId = nanoid(6)
        const view: View = {
            id: nanoid(6),
            width,
            height,
            x,
            y,
            mouldId,
            state: 'default',
        }
        const mould: Mould = {
            id: mouldId,
            name: `Mould ${Object.values(state.moulds).length + 1}`,
            scope: [],
            input: {},
            states: {
                default: {
                    type: 'Stack',
                    props: {},
                },
            },
        }

        state.testWorkspace.views.push(view.id)
        state.views[view.id] = view
        state.moulds[mould.id] = mould

        return state
    },
    initialData
)

type ModifyMouldTreeAction = { id: string; tree: Component; state: string }
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
        state.moulds[action.payload.id].states[action.payload.state] =
            action.payload.tree

        return state
    },
    initialData
)
