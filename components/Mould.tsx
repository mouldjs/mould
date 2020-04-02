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
            __state,
            children,
            requestUpdateProps,
            path,
            ...rest
        }: ComponentPropTypes &
            ComponentProps & { __mouldId: string; __state: string },
        ref
    ) => {
        const mould = useSelector((state: EditorState) => {
            return state.moulds[__mouldId]
        })
        const { states, input } = mould
        const stateNames = Object.keys(states)

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
                <Provider value={mould}>{children}</Provider>
            </Fragment>
        )
    }
)

export default Mould
