import React, { useState, useRef, useContext } from 'react'
import dynamic from 'next/dynamic'
import { Component, Path } from './types'
import { MouldContext, ViewContext } from './Contexts'
import Components from '../components'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { useIsSelectedPath, useIsDraggingComponent } from './utils'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Server, Anchor } from 'react-feather'
import { tick } from './selectionTick'
import {
    insertComponentOnPath,
    modifyMouldTreePropsOnPath,
    modifyMouldTreeChildrenOnPath,
    wrapChild,
    transfromNodeToKit,
} from './appShell'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
})

type PathProps = {
    path: Path
}

const PopoverContent = ({ content }: { content: string }) => {
    return (
        <div
            style={{
                padding: 5,
            }}
        >
            {content}
        </div>
    )
}

export const Tree = ({
    type,
    props,
    children,
    path,
    root = false,
}: Component & PathProps & { root?: boolean }) => {
    const dispatch = useDispatch()
    const mould = useContext(MouldContext)
    const view = useContext(ViewContext)
    const selected = useIsSelectedPath(path)
    const [{ canDrop }, drop] = useDrop<
        { type: string; name: string; props?: object; children?: Component[] },
        void,
        { canDrop: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            const canDrop =
                monitor.canDrop() && monitor.isOver({ shallow: true })

            canDrop &&
                dispatch(
                    insertComponentOnPath({
                        component: {
                            type: item.name,
                            props: item.props || {},
                            children: item.children,
                        },
                        path,
                    })
                )
        },
        collect: (monitor) => {
            let canDrop = false
            try {
                canDrop = monitor.canDrop()
            } catch (e) {}

            return {
                canDrop: canDrop && monitor.isOver({ shallow: true }),
            }
        },
    })
    const isDragging = useIsDraggingComponent()

    const [toolbarOffsetTop, setToolbarOffsetTop] = useState<number>(0)

    const compRef = useRef()

    if (!mould) {
        return null
    }
    const plugin = Components.find((c) => c.type === type)
    if (!plugin) {
        return null
    }
    const Comp = plugin.Editable

    let inside =
        Array.isArray(children) && children.length
            ? children.map((tree, index) => {
                  return (
                      <Tree
                          path={[path[0], [...path[1], index]] as Path}
                          {...tree}
                      ></Tree>
                  )
              })
            : null
    return (
        <>
            {!isDragging && selected && !root && compRef.current && (
                <>
                    <Moveable
                        target={compRef.current}
                        origin={false}
                    ></Moveable>
                    <div
                        ref={(dom) => {
                            if (
                                dom?.nextElementSibling instanceof HTMLElement
                            ) {
                                const targetDOM = dom?.nextElementSibling
                                const [offsetTop, offsetLeft] = [
                                    targetDOM.offsetTop +
                                        targetDOM.clientHeight +
                                        10,
                                    targetDOM.offsetLeft + 20,
                                ]
                                setToolbarOffsetTop(offsetTop)
                            }
                        }}
                        style={{
                            position: 'absolute',
                            transform: `translate(20px,${toolbarOffsetTop}px)`,
                            minWidth: '160px',
                            border: '1px solid #aaa',
                            borderRadius: '3px',
                            padding: '10px',
                            backgroundColor: '#f0f0f0',
                            fontSize: '20px',
                            color: '#aaa',
                            boxShadow: '1px 1px 5px #ddd',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: 5,
                                height: '100%',
                                backgroundColor: '#aaa',
                            }}
                        ></div>
                        <Popover
                            interactionKind={PopoverInteractionKind.HOVER}
                            autoFocus={false}
                            content={
                                <PopoverContent content="Wrap in a Stack"></PopoverContent>
                            }
                        >
                            <Server
                                onClick={() => {
                                    dispatch(
                                        wrapChild({
                                            container: 'Stack',
                                        })
                                    )
                                }}
                                size={28}
                                color="#aaa"
                            />
                        </Popover>
                        {plugin.type !== 'Kit' && (
                            <Popover
                                interactionKind={PopoverInteractionKind.HOVER}
                                autoFocus={false}
                                content={
                                    <PopoverContent content="Transform to a Kit"></PopoverContent>
                                }
                            >
                                <Anchor
                                    className="m-l"
                                    onClick={() => {
                                        dispatch(
                                            transfromNodeToKit({
                                                type: plugin.type,
                                            })
                                        )
                                    }}
                                    size={28}
                                    color="#aaa"
                                />
                            </Popover>
                        )}
                    </div>
                </>
            )}
            {canDrop && (
                <Moveable target={compRef.current} origin={false}></Moveable>
            )}
            <Comp
                ref={(dom) => {
                    // TODO temp fix, need to find a better solution
                    let acceptChildren = plugin.acceptChildren
                    if (
                        plugin.type === 'Kit' &&
                        view?.mouldName === mould.name
                    ) {
                        const __kitName = (props as any).__kitName
                        const kit = mould.kits.find(
                            (kit) => kit.name === __kitName
                        )
                        if (!kit) {
                            throw Error(`Kit '${__kitName}' not found`)
                        }
                        const p = Components.find((c) => c.type === kit.type)
                        acceptChildren = p?.acceptChildren
                    }
                    acceptChildren && drop(dom)
                    compRef.current = dom
                }}
                onDoubleClick={() => {
                    tick((tickData = []) => {
                        tickData.unshift(path)

                        return tickData
                    })
                }}
                requestUpdateProps={(nextProps) => {
                    dispatch(
                        modifyMouldTreePropsOnPath({
                            mouldName: path[0][0],
                            state: path[0][1],
                            props: nextProps,
                            path: path[1],
                        })
                    )
                }}
                requestUpdateChildren={(updateChildren) => {
                    dispatch(
                        modifyMouldTreeChildrenOnPath({
                            mouldName: path[0][0],
                            state: path[0][1],
                            path: path[1],
                            children: updateChildren(children),
                        })
                    )
                }}
                path={path}
                {...props}
            >
                {inside}
            </Comp>
        </>
    )
}
