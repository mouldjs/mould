import React, { useState, useRef, useContext } from 'react'
import dynamic from 'next/dynamic'
import { Component, Path, ParentContext, ParentContextProps } from './types'
import { MouldContext, ViewContext } from './Contexts'
import Components from '../components'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { useIsSelectedPath, useIsDraggingComponent } from './utils'
import { tick } from './selectionTick'
import {
    insertComponentOnPath,
    modifyMouldTreePropsOnPath,
    modifyMouldTreeChildrenOnPath,
} from './appShell'
import NodeToolbar from './NodeToobar'

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
    parent,
}: Component & PathProps & { root?: boolean } & ParentContextProps) => {
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

    const compRef = useRef<HTMLElement>()

    if (!mould) {
        return null
    }
    const plugin = Components.find((c) => c.type === type)
    if (!plugin) {
        return null
    }
    const Comp = plugin.Editable
    const ChildrenMoveable = parent?.component.ChildrenMoveable

    let inside =
        Array.isArray(children) && children.length
            ? children.map((tree, index) => {
                  const context: ParentContext = {
                      props,
                      component: plugin,
                      childrenIndex: index,
                  }
                  return (
                      <Tree
                          path={[path[0], [...path[1], index]] as Path}
                          {...tree}
                          parent={context}
                      ></Tree>
                  )
              })
            : null
    return (
        <>
            {!isDragging && selected && !root && compRef.current && (
                <>
                    {ChildrenMoveable ? (
                        <ChildrenMoveable
                            props={props}
                            target={compRef.current}
                            requestUpdateProps={(nextProps) => {
                                dispatch(
                                    modifyMouldTreePropsOnPath({
                                        mouldName: path[0][0],
                                        state: path[0][1],
                                        props: (nextProps as any) as string,
                                        path: path[1],
                                    })
                                )
                            }}
                        ></ChildrenMoveable>
                    ) : (
                        <Moveable
                            target={compRef.current}
                            origin={false}
                        ></Moveable>
                    )}
                    <NodeToolbar type={plugin.type} />
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
                parent={parent}
            >
                {inside}
            </Comp>
            {!isDragging && selected && root && (
                <NodeToolbar type={plugin.type} />
            )}
        </>
    )
}
