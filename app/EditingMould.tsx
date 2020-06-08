import React from 'react'
import { Mould } from './types'
import { Tree } from './Tree'
import { useDispatch } from 'react-redux'
import { modifyMouldTree } from './appShell'
import { MouldContext } from './Contexts'

const { Provider } = MouldContext

type currentState = { currentState: string }

export default ({ currentState, ...mould }: Mould & currentState) => {
    const dispatch = useDispatch()
    const { states, name } = mould
    const tree = states[currentState]

    if (!tree) {
        return null
    }

    return (
        <Provider value={mould}>
            <Tree
                root
                path={[[name, currentState], []]}
                onChange={(tree) => {
                    dispatch(
                        modifyMouldTree({
                            mouldName: name,
                            tree,
                            state: currentState,
                        })
                    )
                }}
                {...tree}
            ></Tree>
        </Provider>
    )
}
