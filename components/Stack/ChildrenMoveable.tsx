import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import { ChildrenMoveable, EditorState } from '../../app/types'
import { useSelector, useDispatch } from 'react-redux'
import {
    LayoutSize,
    LayoutPropTypes,
    layoutSizeToString,
    initialData,
} from '../../inspector/Layout'
import { FlexProps } from '../../inspector/InspectorProvider'
import { MoveableProps } from 'react-moveable/declaration/types'
import { initialFlexData } from './Inspector'
import { StackProps } from './Stack'
import { sortMouldTreeChildrenOnPath } from '../../app/appShell'
import styled from 'styled-components'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
}) as React.ComponentType<MoveableProps & { ref: any }>

const DropPlaceholder = styled.div({
    position: 'absolute',
    background: 'rgba(63,127,255,0.5)',
    width: '0',
    height: '0',
    display: 'none',
})

const defaultLayoutValue = {
    width: { amount: 100, unit: '%' } as LayoutSize,
    height: { amount: 100, unit: '%' } as LayoutSize,
}

function addPxToLayoutSize(
    px: number,
    size: LayoutSize,
    containerLength: number
): LayoutSize {
    switch (size.unit) {
        case 'auto':
            return size
        case 'px':
            return {
                amount: Math.round(size.amount + px),
                unit: 'px',
            }
        case '%':
            return {
                amount: size.amount + (px / containerLength) * 100,
                unit: '%',
            }
    }
}

function prepareDimension(
    target: Element,
    layout?: LayoutPropTypes,
    flex?: FlexProps
) {
    const width = layout?.width || defaultLayoutValue.width
    const height = layout?.height || defaultLayoutValue.height
    const grow = flex?.grow || initialFlexData.grow
    const shrink = flex?.shrink || initialFlexData.shrink

    const containerWidth = target.parentElement
        ? target.parentElement.clientWidth
        : window.innerWidth
    const containerHeight = target.parentElement
        ? target.parentElement.clientHeight
        : window.innerHeight
    return {
        width,
        height,

        containerWidth,
        containerHeight,
    }
}

const getElementCenter = (
    element: SVGElement | HTMLElement
): { x: number; y: number } => {
    const rect = element.getBoundingClientRect()
    return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2,
    }
}

export const StackChildrenMoveable: ChildrenMoveable = ({
    requestUpdateProps,
    props,
    target,
    parentContext,
    path,
}) => {
    const workspaceZoom =
        useSelector((state: EditorState) => state.testWorkspace.zoom) || 1

    const ref = useRef<any>()
    const placeHolderRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    const flex = props.containerLayoutProps?.flex
    const layout = props.layoutProps
    let lastFlex: FlexProps | undefined
    let lastLayout: { width: LayoutSize; height: LayoutSize } | undefined
    const parentProps = parentContext.props as StackProps
    let siblingComponentPositions: Array<{ x: number; y: number }> = []
    let startIndex: number | undefined
    let lastIndex: number | undefined
    let offset = { x: 0, y: 0 }
    ref.current?.retry()

    return (
        <>
            <Moveable
                ref={ref}
                zoom={1 / workspaceZoom}
                resizable
                draggable
                snappable
                target={target}
                onResize={({ target, dist: [mx, my], direction: [dx, dy] }) => {
                    const {
                        width,
                        height,
                        containerWidth,
                        containerHeight,
                    } = prepareDimension(target, layout, flex)
                    const nextWidth = addPxToLayoutSize(
                        mx,
                        width,
                        containerWidth
                    )
                    const nextHeight = addPxToLayoutSize(
                        my,
                        height,
                        containerHeight
                    )
                    lastLayout = {
                        width: nextWidth,
                        height: nextHeight,
                    }
                    Object.assign(target.style, {
                        width: layoutSizeToString(nextWidth),
                        height: layoutSizeToString(nextHeight),
                    })
                }}
                onResizeEnd={({ target }) => {
                    if (lastLayout) {
                        requestUpdateProps({
                            layoutProps: {
                                ...initialData,
                                ...props.layoutProps,
                                ...lastLayout,
                            },
                        })
                    }
                    Object.assign(target.style, {
                        width: '',
                        height: '',
                    })
                }}
                onDragStart={({ target, currentTarget }) => {
                    currentTarget.setState({ enableSnap: false })
                    const sibling = parentContext.childrenCompRef?.current ?? []
                    siblingComponentPositions = sibling.map(getElementCenter)
                    lastIndex = startIndex = sibling.indexOf(
                        target as HTMLElement
                    )
                    offset = { x: 0, y: 0 }
                    if (
                        placeHolderRef.current &&
                        target instanceof HTMLElement
                    ) {
                        Object.assign(placeHolderRef.current.style, {
                            left: target.offsetLeft + 'px',
                            top: target.offsetTop + 'px',
                            width: target.offsetWidth + 'px',
                            height: target.offsetHeight + 'px',
                            display: 'block',
                        })
                    }
                    Object.assign(target.style, {
                        zIndex: '1000',
                    })
                }}
                onDrag={({ target, dist: [mx, my], clientX, clientY }) => {
                    const sibling = parentContext.childrenCompRef?.current ?? []
                    let position = { x: clientX, y: clientY }

                    const { index } = siblingComponentPositions.reduce(
                        (prev, value, index) => {
                            const dx = position.x - value.x
                            const dy = position.y - value.y
                            const diff = Math.sqrt(dx * dx + dy * dy)
                            if (diff < prev.diff) {
                                return { index, diff }
                            } else {
                                return prev
                            }
                        },
                        {
                            index: -1,
                            diff: Number.MAX_VALUE,
                        }
                    )
                    if (index !== lastIndex) {
                        const lastPos = getElementCenter(target)
                        if (lastIndex !== undefined && index !== undefined) {
                            sibling.splice(lastIndex, 1)
                            if (index < sibling.length) {
                                sibling[index].insertAdjacentElement(
                                    'beforebegin',
                                    target
                                )
                            } else {
                                sibling[
                                    sibling.length - 1
                                ].insertAdjacentElement('afterend', target)
                            }
                            sibling.splice(index, 0, target)
                            if (
                                placeHolderRef.current &&
                                target instanceof HTMLElement
                            ) {
                                Object.assign(placeHolderRef.current.style, {
                                    left: target.offsetLeft + 'px',
                                    top: target.offsetTop + 'px',
                                    width: target.offsetWidth + 'px',
                                    height: target.offsetHeight + 'px',
                                    display: 'block',
                                })
                            }
                        }
                        const newPos = getElementCenter(target)
                        offset.x += (lastPos.x - newPos.x) / workspaceZoom
                        offset.y += (lastPos.y - newPos.y) / workspaceZoom
                        lastIndex = index
                    }
                    Object.assign(target.style, {
                        transform: `translate(${mx + offset.x}px,${
                            my + offset.y
                        }px)`,
                    })
                }}
                onDragEnd={({ target }) => {
                    const sibling = parentContext.childrenCompRef?.current ?? []
                    Object.assign(target.style, {
                        transform: '',
                        zIndex: '',
                    })
                    if (placeHolderRef.current) {
                        Object.assign(placeHolderRef.current.style, {
                            width: '0',
                            height: '0',
                            display: 'none',
                        })
                    }
                    if (
                        startIndex !== undefined &&
                        lastIndex !== undefined &&
                        startIndex !== lastIndex
                    ) {
                        sibling.splice(lastIndex, 1)
                        if (startIndex < sibling.length) {
                            sibling[startIndex].insertAdjacentElement(
                                'beforebegin',
                                target
                            )
                        } else {
                            sibling[sibling.length - 1].insertAdjacentElement(
                                'afterend',
                                target
                            )
                        }
                        sibling.splice(startIndex, 0, target)
                        dispatch(
                            sortMouldTreeChildrenOnPath({
                                mouldName: path[0][0],
                                state: path[0][1],
                                path: path[1].slice(0, path[1].length - 1), // get parent's path
                                from: startIndex,
                                to: lastIndex,
                            })
                        )
                    }
                }}
                elementGuidelines={parentContext.childrenCompRef?.current ?? []}
            ></Moveable>
            <DropPlaceholder ref={placeHolderRef}></DropPlaceholder>
        </>
    )
}
