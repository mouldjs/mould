import React, { useState } from 'react'
import { Component, EditorState } from './types'
import { useEditable } from './MouldContext'
import Components from '../components'
import { useDrop } from 'react-dnd-cjs'
import { useSelector, useDispatch } from 'react-redux'
import { selectComponent } from './appShell'
import { useHover, useGesture } from 'react-use-gesture'
import { selectedThis, selectionInsideThis, includeSelection } from './utils'
import { Box } from '@modulz/radix'

const GREEN = '#8ed80e'
const BLUE = '#56a9f1'

type Edit = {
    onChange: (tree: Component) => void
}

type Path = {
    path: number[]
}

const doNothing = () => {}

const Gap = ({ onDrop }: { onDrop: (type: string) => void }) => {
    const [{ isOver }, drop] = useDrop<
        { type: string; name: string },
        void,
        { isOver: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            if (!monitor.getDropResult()) {
                onDrop(item.name)
            }

            return true
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

const Tree = ({
    type,
    props,
    children,
    onChange,
    path,
}: Component & Edit & Path) => {
    const dispatch = useDispatch()
    const editable = useEditable()
    const selection = useSelector((state: EditorState) => state.selection)
    const selected = selectedThis(selection, path)
    const included = includeSelection(selection, path)
    const [{ isOver, canDrop }, drop] = useDrop<
        { type: string; name: string },
        void,
        { isOver: boolean; canDrop: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            if (monitor.getDropResult()) {
                return true
            }

            if (!selected) {
                return
            }
            onChange({
                type,
                props,
                children: [...(children || []), { type: item.name, props: {} }],
            })

            return true
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

    const Comp = Components[type]
    let inside =
        children &&
        children.map((tree, index) => (
            <Tree
                path={[...path, index]}
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
            const nextChildren = [...children]
            nextChildren.splice(index, 0, { type: droppedType, props: {} })
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
        <Comp
            ref={drop}
            outline={
                selected
                    ? isOver
                        ? `2px solid ${GREEN}`
                        : `2px solid ${BLUE}`
                    : 'none'
            }
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
    )
}

export default Tree
