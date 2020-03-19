import React, { forwardRef, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentInspector } from '../app/Inspectors'
import { Select } from '@modulz/radix'
import * as z from 'zod'
import {
    ComponentPropTypes,
    ComponentProps,
    Mould as MouldType,
    Component,
    EditorState,
} from '../app/types'
import MouldContext from '../app/MouldContext'
import MouldComponent from '../app/Mould'
import { rootTree } from '../app/utils'
import Root from './Root'
import Tree from './Tree'

const { Provider } = MouldContext

// const Tree = forwardRef(
//     ({ type, props, children, ...rest }: Component, ref) => {
//         const Comp = Components[type]

//         return (
//             <Comp {...rest} {...props} ref={ref}>
//                 {children && children.map(c => <Tree {...c}></Tree>)}
//             </Comp>
//         )
//     }
// )

const Mould = forwardRef(
    (
        {
            __mouldId,
            mockState,
            requestUpdateProps,
            path,
            ...rest
        }: ComponentPropTypes &
            ComponentProps & { __mouldId: string; mockState: string },
        ref
    ) => {
        const mould = useSelector((state: EditorState) => {
            return state.moulds[__mouldId]
        })
        const { states } = mould
        const stateNames = Object.keys(states)
        const currentMockState = mockState || stateNames[0]
        const tree = rootTree(mould.rootProps, states[currentMockState])

        return (
            <Fragment>
                <ComponentInspector path={path}>
                    <TitledBoard title="Mould">
                        <Cell label="input">input</Cell>
                    </TitledBoard>
                </ComponentInspector>
                <Provider value={mould}>
                    <Tree component={tree} ref={ref}></Tree>
                </Provider>
            </Fragment>
        )
    }
)

export default Mould
