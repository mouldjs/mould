import React, { forwardRef, Fragment } from 'react'
import Components from '.'
import { useSelector } from 'react-redux'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentInspector } from '../app/Inspectors'
import { Select } from '@modulz/radix'
import * as z from 'zod'
import {
    ComponentPropTypes,
    zodComponentProps,
    Mould as MouldType,
    Component,
    EditorState,
} from '../app/types'

export const mouldProps = z
    .object({
        mouldId: z.string(),
        mockState: z.string().optional(),
    })
    .merge(zodComponentProps)

type PropType = z.TypeOf<typeof mouldProps>

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
        }: ComponentPropTypes & PropType,
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
                <Tree
                    {...rest}
                    children={children}
                    {...currentMockTree}
                    ref={ref}
                ></Tree>
            </Fragment>
        )
    }
)

export default Mould
