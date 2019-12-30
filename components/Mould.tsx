import React, { forwardRef, Fragment } from 'react'
import {
    Mould as MouldType,
    Component,
    ComponentPropTypes,
    EditorState,
} from '../app/types'
import Components from '.'
import { useSelector } from 'react-redux'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentInspector } from '../app/Inspectors'
import { Select } from '@modulz/radix'

const Tree = forwardRef(
    ({ type, props, children, ...rest }: Component, ref) => {
        const Comp = Components[type]

        return (
            <Comp {...rest} {...props} ref={ref}>
                {children && children.map(c => <Tree {...c}></Tree>)}
            </Comp>
        )
    }
)

const Mould = forwardRef(
    (
        {
            mouldId,
            mockState,
            requestUpdateProps,
            children,
            path,
            ...rest
        }: ComponentPropTypes & { mouldId: string; mockState: string },
        ref
    ) => {
        const { states } = useSelector((state: EditorState) => {
            return state.moulds[mouldId]
        })
        const stateNames = Object.keys(states)
        const currentMockState = mockState || stateNames[0]
        const currentMockTree = states[currentMockState]

        return (
            <Fragment>
                <ComponentInspector path={path}>
                    <TitledBoard title="Mould">
                        <Cell label="input">input</Cell>
                    </TitledBoard>
                </ComponentInspector>
                <Tree {...rest} {...currentMockTree} ref={ref}></Tree>
            </Fragment>
        )
    }
)

export default Mould
