import React, { forwardRef, Fragment, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { omit } from 'lodash'
import { ZoomIn } from 'react-feather'
import {
    TitledBoard,
    ControlGridItem,
    ControlGrid,
} from '../inspector/FormComponents'
import { ComponentInspector } from '../app/Inspectors'
import { ComponentPropTypes, Component, EditorState } from '../app/types'
import { MouldContext, ViewContext } from '../app/Contexts'
import { pathToString } from '../app/utils'
import { Tree } from '../app/Tree'
import Components from '.'
import Controls from '../controls'
import { Error, Info } from '../app/Messager'
import { renderRecursiveMould } from '../app/appShell'
import { tick } from '../app/selectionTick'

const { Provider } = MouldContext

type PropPatch = {
    [path: string]: object
}

const Mould = forwardRef(
    (
        {
            __mouldName,
            __state,
            __patches = {},
            children,
            requestUpdateProps,
            onDoubleClick,
            path,
            ...rest
        }: ComponentPropTypes & {
            __mouldName: string
            __state: string
            __patches: PropPatch
            onDoubleClick: any
        },
        ref
    ) => {
        const dispatch = useDispatch()
        const recursiveRendered =
            useSelector((state: EditorState) => {
                return state.recursiveRendered
            }) || []
        const mould = useSelector((state: EditorState) => {
            return state.moulds.find((m) => m.name === __mouldName)
        })
        const view = useContext(ViewContext)

        if (!mould) {
            return (
                <Error
                    ref={ref as any}
                >{`Mould ${__mouldName} not found.`}</Error>
            )
        }

        const { states, input, kits } = mould

        if (__mouldName === view?.mouldName) {
            const pathStr = pathToString(path!)
            const recursiveRender = recursiveRendered.includes(pathStr)

            if (!recursiveRender) {
                return (
                    <Info ref={ref as any} onDoubleClick={onDoubleClick}>
                        <span
                            onClick={() => {
                                dispatch(renderRecursiveMould({ key: pathStr }))
                            }}
                        >
                            <ZoomIn
                                color="white"
                                style={{ cursor: 'pointer' }}
                            ></ZoomIn>
                        </span>
                    </Info>
                )
            }
        }

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

            const Comp = plugin.Editable

            let index = 0

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
                const patch = __patches[pathStr] || {}
                const Comp = Components.find((c) => c.type === kit.type)!
                    .Editable

                return (
                    <Comp
                        {...{ ...props, ...patch }}
                        path={path}
                        ref={isRoot ? ref : undefined}
                        onDoubleClick={
                            isRoot
                                ? onDoubleClick
                                : () => {
                                      tick((tickData = []) => {
                                          tickData.unshift(path)

                                          return tickData
                                      })
                                  }
                        }
                        requestUpdateProps={(nextProps) => {
                            const nextPatch = {
                                __patches: {
                                    ...__patches,
                                    [pathStr]: nextProps,
                                },
                            }

                            requestUpdateProps && requestUpdateProps(nextPatch)
                        }}
                        connectedFields={fields}
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
                <Comp
                    {...props}
                    path={path}
                    ref={isRoot ? ref : undefined}
                    onDoubleClick={isRoot ? onDoubleClick : undefined}
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
                        {Object.keys(input).map((name, index) => {
                            const isFirst = index === 0
                            const config = input[name]
                            const Control = Controls[config.type].Renderer

                            return (
                                <ControlGrid marginTop={isFirst ? 0 : 8}>
                                    <ControlGridItem area="active / active / visual / visual">
                                        {name}
                                    </ControlGridItem>
                                    <ControlGridItem area="value / value / control / control">
                                        <Control
                                            config={config}
                                            data={rest[name]}
                                            onChange={(value) => {
                                                requestUpdateProps!({
                                                    [name]: value,
                                                })
                                            }}
                                        ></Control>
                                    </ControlGridItem>
                                </ControlGrid>
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
