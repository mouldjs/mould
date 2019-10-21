import React from 'react'
import { Mould, Component, EditorState } from './types'
import MouldContext from './MouldContext'
import Tree from './Tree'
import { createAction, handleAction } from 'redux-actions'
import { initialData } from './utils'
import { useDispatch } from 'react-redux'

type ModifyMouldTreeAction = { id: string; tree: Component; state: string }
const MODIFY_MOULD_TREE = 'MODIFY_MOULD_TREE'
const modifyMouldTree = createAction<ModifyMouldTreeAction>(MODIFY_MOULD_TREE)
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

const { Provider } = MouldContext
type Editable = { editable: boolean }
type currentState = { currentState: string }

export default ({
    id,
    currentState,
    states,
    editable = false,
}: Mould & Editable & currentState) => {
    const dispatch = useDispatch()
    const tree = states[currentState]

    return (
        <Provider value={editable}>
            <Tree
                path={[id, currentState]}
                onChange={tree => {
                    dispatch(modifyMouldTree({ id, tree, state: currentState }))
                }}
                {...tree}
            ></Tree>
        </Provider>
    )
}
