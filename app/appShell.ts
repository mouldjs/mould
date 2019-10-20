import { createAction, handleAction } from 'redux-actions'
import { EditorState, Path } from './types'
import { initialData } from './utils'
import { string } from 'prop-types'

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
        state.moulds[action.payload.mouldId].states.push(action.payload.state)

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
        const index = state.moulds[action.payload.mouldId].states.findIndex(
            value => value === action.payload.state
        )
        if (index !== -1) {
            state.moulds[action.payload.mouldId].states.splice(index, 1)
        }

        return state
    },
    initialData
)
