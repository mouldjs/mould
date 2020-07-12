import React, { forwardRef, Fragment, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ZoomIn } from 'react-feather'
import {
    TitledBoard,
    ControlGridItem,
    ControlGrid,
} from '../inspector/FormComponents'
import { ComponentInspector } from '../app/Inspectors'
import { ComponentPropTypes, Component, EditorState, Path } from '../app/types'
import { MouldContext, ViewContext } from '../app/Contexts'
import { pathToString } from '../app/utils'
import MouldApp from '../mould'
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
            localPath,
            isRoot = false
        ) => {
            const plugin = MouldApp.getComponent(type)

            if (!plugin) {
                return null
            }

            const Comp = plugin.Editable

            let index = 0
            let isKit = type === 'Kit'
            const pathStr = localPath.join('-')

            if (isKit) {
                const kitName = (props as any).__kitName
                const kit = kits.find((k) => k.name === kitName)
                if (!kit) {
                    return null
                }
                const patch = __patches[pathStr] || {}
                props = { ...props, ...patch }
            }

            const globalPath = [path![0], path![1].concat(localPath)] as Path

            return (
                <Comp
                    {...props}
                    path={globalPath}
                    ref={isRoot ? ref : undefined}
                    onDoubleClick={
                        isRoot
                            ? onDoubleClick
                            : isKit
                            ? () => {
                                  tick((tickData = []) => {
                                      tickData.unshift(globalPath)

                                      return tickData
                                  })
                              }
                            : undefined
                    }
                    requestUpdateProps={
                        isKit
                            ? (nextProps) => {
                                  const nextPatch = {
                                      __patches: {
                                          ...__patches,
                                          [pathStr]: nextProps,
                                      },
                                  }

                                  requestUpdateProps &&
                                      requestUpdateProps(nextPatch)
                              }
                            : undefined
                    }
                >
                    {children &&
                        children.map((c) =>
                            renderTree(
                                c,
                                localPath.concat([
                                    c.type === 'Kit' ? index++ : 10000000,
                                ])
                            )
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
                            const Control = MouldApp.getControl(config.type)
                                .Renderer

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
                    {tree && renderTree(tree, [], true)}
                </Provider>
            </Fragment>
        )
    }
)

export default Mould
