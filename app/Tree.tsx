import React, { useState, useRef, useContext } from 'react'
import dynamic from 'next/dynamic'
import { Component, EditorState, Path } from './types'
import { MouldContext } from './Contexts'
import Components from '../components'
import { useDrop } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { useHover, useGesture } from 'react-use-gesture'
import { useIsSelectedPath, useIsIncludePath, pathToString } from './utils'
import { tick } from './selectionTick'

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

const Gap = ({ onDrop }: { onDrop: (type: string) => void }) => {
    const [{ isOver }, drop] = useDrop<
        { type: string; name: string },
        { res: boolean },
        { isOver: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            if (!monitor.getDropResult() || !monitor.getDropResult().res) {
                onDrop(item.name)
            }

            return { res: true }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    return (
        <div
            style={{
                width: 0,
                height: 0,
                position: 'relative',
            }}
        >
            <div
                ref={drop}
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: isOver ? GREEN : BLUE,
                    position: 'absolute',
                    left: -5,
                    top: -5,
                }}
            ></div>
        </div>
    )
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
    const selected = useIsSelectedPath(path)
    const included = useIsIncludePath(path)
    const [{ isOver, canDrop }, drop] = useDrop<
        { type: string; name: string; props?: object; children?: Component[] },
        { res: boolean },
        { isOver: boolean; canDrop: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            if (monitor.getDropResult() && monitor.getDropResult().res) {
                return { res: true }
            }

            if (!selected) {
                return
            }

            onChange({
                type,
                props,
                children: [
                    ...(children || []),
                    {
                        type: item.name,
                        props: item.props || {},
                        children: item.children,
                    },
                ],
            })

            return { res: true }
        },
        collect: (monitor) => {
            let canDrop = false
            try {
                canDrop = monitor.canDrop()
            } catch (e) {}

            return {
                isOver: monitor.isOver(),
                canDrop,
            }
        },
    })

    const compRef = useRef()

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

    if (inside && canDrop) {
        const handleDrop = (index) => (droppedType) => {
            const nextChildren = [...(children || [])]
            nextChildren.splice(index, 0, {
                type: droppedType,
                props: {},
                children: [],
            })
            onChange({
                type,
                props,
                children: nextChildren,
            })
        }
        inside = inside.reduce(
            (prev, curr, index) => [
                ...prev,
                curr,
                <Gap onDrop={handleDrop(index + 1)}></Gap>,
            ],
            [<Gap onDrop={handleDrop(0)}></Gap>]
        )
    }

    return (
        <>
            {selected && !root && compRef.current && (
                <Moveable
                    target={compRef.current}
                    origin={false}
                    // rotatable
                ></Moveable>
            )}
            <Comp
                // id={pathStr}
                ref={(dom) => {
                    drop(dom)
                    compRef.current = dom
                }}
                // outline={
                //     selected && !root
                //         ? isOver
                //             ? `2px solid ${GREEN}`
                //             : `2px solid ${BLUE}`
                //         : 'none'
                // }
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
