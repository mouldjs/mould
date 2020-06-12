import React, { useState, useRef, useContext } from 'react'
import dynamic from 'next/dynamic'
import { Component, EditorState, Path } from './types'
import { MouldContext, ViewContext } from './Contexts'
import Components from '../components'
import { useDrop } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { useHover, useGesture } from 'react-use-gesture'
import {
    useIsSelectedPath,
    useIsIncludePath,
    pathToString,
    useIsDraggingComponent,
} from './utils'
import { tick } from './selectionTick'
import { insertComponentOnPath } from './appShell'

const { Provider } = MouldContext

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
})

const GREEN = '#8ed80e'
const BLUE = '#56a9f1'

type Edit = {
    onChange: (tree: Component) => void
}

type PathProps = {
    path: Path
}

export const Tree = ({
    type,
    props,
    children,
    onChange,
    path,
    root = false,
}: Component & Edit & PathProps & { root?: boolean }) => {
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
                          onChange={(tree) => {
                              const nextChildren = [...children]
                              nextChildren[index] = tree
                              onChange({
                                  type,
                                  props,
                                  children: nextChildren,
                              })
                          }}
                          {...tree}
                      ></Tree>
                  )
              })
            : null

    return (
        <>
            {!isDragging && selected && !root && compRef.current && (
                <Moveable target={compRef.current} origin={false}></Moveable>
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
                    onChange({
                        type,
                        props: { ...props, ...nextProps },
                        children,
                    })
                }}
                requestUpdateChildren={(updateChildren) => {
                    onChange({
                        type,
                        props,
                        children: updateChildren(children),
                    })
                }}
                path={path}
                {...props}
            >
                {inside}
            </Comp>
        </>
    )
}
