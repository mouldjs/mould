import React, { forwardRef, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { pick } from 'ramda'
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
import { rootTree, pathToString, useCurrentMould } from '../app/utils'
import { Tree } from '../app/Tree'
import Components from '.'

const { Provider } = MouldContext

type PropPatch = {
    [path: string]: object
}

const Mould = forwardRef(
    (
        {
            __mouldId,
            __state,
            __patches = {},
            children,
            requestUpdateProps,
            onDoubleClickCapture,
            path,
            ...rest
        }: ComponentPropTypes &
            ComponentProps & {
                __mouldId: string
                __state: string
                __patches: PropPatch
                onDoubleClickCapture: any
            },
        ref
    ) => {
        const mould = useSelector((state: EditorState) => {
            return state.moulds[__mouldId]
        })
        const { states, input, kits } = mould
        const tree = states[__state]

        const renderTree = (
            { type, children, props }: Component,
            path,
            isRoot = false
        ) => {
            const plugin = Components.find((c) => c.type === type)

            if (!plugin) {
                return null
            }

            const Comp = plugin.component

            if (type === 'Kit') {
                const pathStr = pathToString(path)
                const kitName = (props as any).__kitName
                const kit = kits.find((k) => k.name === kitName)
                if (!kit) {
                    return null
                }
                const fields = kit.dataMappingVector.map(
                    ([propField]) => propField
                )
                const patch = pick(fields, __patches[pathStr] || {})

                return (
                    <Tree
                        path={path}
                        type={type}
                        props={{ ...props, ...patch }}
                        onChange={(tree) => {
                            const patch = pick(fields, tree.props)
                            requestUpdateProps &&
                                requestUpdateProps({
                                    __patches: {
                                        ...__patches,
                                        [pathStr]: patch,
                                    },
                                })
                        }}
                    >
                        {children}
                    </Tree>
                )
            }

            let index = 0

            return (
                <Comp
                    {...props}
                    path={path}
                    ref={isRoot ? ref : undefined}
                    onDoubleClickCapture={
                        isRoot ? onDoubleClickCapture : undefined
                    }
                >
                    {children &&
                        children.map((c) =>
                            renderTree(c, [
                                path[0],
                                [
                                    ...path[1],
                                    c.type === 'Kit' ? index++ : 10000000,
                                ],
                            ])
                        )}
                </Comp>
            )
        }

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
                    {tree && renderTree(tree, path, true)}
                </Provider>
            </Fragment>
        )
    }
)

export default Mould
