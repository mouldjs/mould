import React from 'react'
import { Mould } from './types'
import MouldContext from './MouldContext'
import { Tree } from './Tree'
import { useDispatch } from 'react-redux'
import { modifyMouldTree } from './appShell'
import { mouldTree, rootTree } from './utils'

const { Provider } = MouldContext
type Editable = { editable: boolean }
type currentState = { currentState: string }

export default ({
    id,
    currentState,
    states,
    editable = false,
    rootProps,
}: Mould & Editable & currentState) => {
    const dispatch = useDispatch()
    const tree = rootTree(rootProps, states[currentState])

    return (
        <Provider value={editable}>
            {tree && (
                <Tree
                    root
                    path={[[id, currentState], []]}
                    onChange={tree => {
                        dispatch(
                            modifyMouldTree({ id, tree, state: currentState })
                        )
                    }}
                    {...tree}
                ></Tree>
            )}

            {/* <Tree
                path={[[id, currentState], []]}
                onChange={tree => {
                    dispatch(modifyMouldTree({ id, tree, state: currentState }))
                }}
                type="Stack"
                props={{}}
            ></Tree> */}
        </Provider>
    )
}
