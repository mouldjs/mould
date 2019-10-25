import { createAction, handleAction } from 'redux-actions'
import { EditorState, Path, View, Vector, ViewGroup, Mould } from './types'
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

type ModifyInputControllerAction = {
    mouldId: string
    inputKey: string
    controller: string
}
const MODIFY_INPUT_CONTROLLER = 'MODIFY_INPUT_CONTROLLER'
export const modifyInputController = createAction<ModifyInputControllerAction>(
    MODIFY_INPUT_CONTROLLER
)
export const handleModifyInputControler = handleAction<
    EditorState,
    ModifyInputControllerAction
>(
    MODIFY_INPUT_CONTROLLER,
    (state, action) => {
        state.moulds[action.payload.mouldId].input[action.payload.inputKey] =
            action.payload.controller

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
            width: 300,
            height: 500,
        }
        state.views[view.id] = view
        Object.values(state.viewGroups).find(
            g => g.mouldId === action.payload.mouldId
        ).views[action.payload.state] = view.id

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
        const viewGroupId = Object.values(state.viewGroups).find(
            g => g.mouldId === action.payload.mouldId
        ).id

        state.moulds[action.payload.mouldId].states[
            action.payload.state
        ] = undefined
        delete state.moulds[action.payload.mouldId].states[action.payload.state]

        const viewId = state.viewGroups[viewGroupId].views[action.payload.state]
        state.viewGroups[viewGroupId].views[action.payload.state] = undefined
        delete state.viewGroups[viewGroupId].views[action.payload.state]

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
        const view: View = {
            id: nanoid(6),
            width,
            height,
        }
        const mould: Mould = {
            id: nanoid(6),
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
        const viewGroup: ViewGroup = {
            id: nanoid(6),
            views: { default: view.id },
            mouldId: mould.id,
            x,
            y,
        }

        state.testWorkspace.viewGroups.push(viewGroup.id)
        state.views[view.id] = view
        state.moulds[mould.id] = mould
        state.viewGroups[viewGroup.id] = viewGroup

        return state
    },
    initialData
)
