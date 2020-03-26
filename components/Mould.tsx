import React, { forwardRef, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentInspector } from '../app/Inspectors'
import { Select, Input } from '@modulz/radix'
import * as z from 'zod'
import {
    ComponentPropTypes,
    ComponentProps,
    Mould as MouldType,
    Component,
    EditorState,
} from '../app/types'
import MouldContext from '../app/MouldContext'
import { rootTree } from '../app/utils'
import Tree from './Tree'

const { Provider } = MouldContext

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
        const { states, input } = mould
        const stateNames = Object.keys(states)
        const currentMockState = mockState || stateNames[0]
        const tree = rootTree(mould.rootProps, states[currentMockState])

        return (
            <Fragment>
                <ComponentInspector path={path}>
                    <TitledBoard title="Mould">
                        {input.map((i) => {
                            return (
                                <Cell label={i}>
                                    <Input
                                        value={rest[i]}
                                        onChange={(e) =>
                                            requestUpdateProps!({
                                                [i]: e.target.value,
                                            })
                                        }
                                    ></Input>
                                </Cell>
                            )
                        })}
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
