import { createAction, handleAction } from 'redux-actions'
import { EditorState } from './types'
import { initialData } from './utils'

type SelectComponentAction = { selection: number[] }
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
