import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Component, EditorState, Path } from './types'
import { useEditable } from './MouldContext'
import Components from '../components'
import { useDrop } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { selectComponent } from './appShell'
import { useHover, useGesture } from 'react-use-gesture'
import { useIsSelectedPath, useIsIncludePath } from './utils'
import { Box } from '@modulz/radix'

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

const doNothing = () => {}

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
        collect: monitor => ({
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
    const editable = useEditable()
    const selected = useIsSelectedPath(path)
    const included = useIsIncludePath(path)
    const [{ isOver, canDrop }, drop] = useDrop<
        { type: string; name: string; props?: object },
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
                    ...children,
                    { type: item.name, props: item.props || {}, children: [] },
                ],
            })

            return { res: true }
        },
        collect: monitor => {
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

    const plugin = Components.find(c => c.type === type)
    if (!plugin) {
        return null
    }
    const Comp = plugin.component

    let inside =
        children &&
        children.map((tree, index) => (
            <Tree
                path={[path[0], [...path[1], index]] as Path}
                onChange={
                    editable
                        ? tree => {
                              const nextChildren = [...children]
                              nextChildren[index] = tree
                              onChange({
                                  type,
                                  props,
                                  children: nextChildren,
                              })
                          }
                        : doNothing
                }
                {...tree}
            ></Tree>
        ))

    if (inside && canDrop) {
        const handleDrop = index => droppedType => {
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
                ref={dom => {
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
                onDoubleClickCapture={event => {
                    if (included) {
                        return
                    }
                    event.stopPropagation()
                    const selection = path
                    dispatch(selectComponent({ selection }))
                }}
                requestUpdateProps={
                    editable &&
                    (nextProps => {
                        onChange({
                            type,
                            props: { ...props, ...nextProps },
                            children,
                        })
                    })
                }
                path={path}
                {...props}
            >
                {inside}
            </Comp>
        </>
    )
}
