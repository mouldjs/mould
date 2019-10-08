import React from 'react'
import { Mould, Component, EditorState } from './types'
import MouldContext from './MouldContext'
import Tree from './Tree'
import { createAction, handleAction } from 'redux-actions'
import { initialData } from './utils'
import { useDispatch } from 'react-redux'

type ModifyMouldTreeAction = { id: string; tree: Component }
const MODIFY_MOULD_TREE = 'MODIFY_MOULD_TREE'
const modifyMouldTree = createAction<ModifyMouldTreeAction>(MODIFY_MOULD_TREE)
export const handleModifyMouldTree = handleAction<
    EditorState,
    ModifyMouldTreeAction
>(
    MODIFY_MOULD_TREE,
    (state, action) => {
        state.moulds[action.payload.id].tree = action.payload.tree

        return state
    },
    initialData
)

const { Provider } = MouldContext
type Editable = { editable: boolean }

export default ({ id, tree, editable = false }: Mould & Editable) => {
    const dispatch = useDispatch()

    return (
        <Provider value={editable}>
            <Tree
                path={[id]}
                onChange={tree => {
                    dispatch(modifyMouldTree({ id, tree }))
                }}
                {...tree}
            ></Tree>
        </Provider>
    )
}
