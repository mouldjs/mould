import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import { ChildrenMoveable } from '../../app/types'
import {
    LayoutSize,
    layoutSizeToString,
    LayoutPropTypes,
    initialData,
} from '../../inspector/Layout'
import { initialRelativeData } from './Inspector'
import { RelativeProps } from '../../inspector/InspectorProvider'
import { MoveableProps } from 'react-moveable'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
}) as React.ComponentType<MoveableProps & { ref: any }>

const defaultLayoutValue = {
    width: { amount: 0, unit: 'auto' } as LayoutSize,
    height: { amount: 0, unit: 'auto' } as LayoutSize,
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
                amount: size.amount + px,
                unit: 'px',
            }
        case '%':
            return {
                amount: size.amount + (px / containerLength) * 100,
                unit: '%',
            }
    }
}

function getNewRelativeValue(
    direction: number,
    dist: number,
    containerLength: number,
    elementLength: LayoutSize,
    start: LayoutSize,
    end: LayoutSize
): { start: LayoutSize; end: LayoutSize; length: LayoutSize } {
    if (direction === -1) {
        return {
            start: addPxToLayoutSize(-dist, start, containerLength),
            length: addPxToLayoutSize(dist, elementLength, containerLength),
            end: end,
        }
    }
    if (direction === 1) {
        return {
            start: start,
            length: addPxToLayoutSize(dist, elementLength, containerLength),
            end: addPxToLayoutSize(-dist, end, containerLength),
        }
    }
    return {
        start: addPxToLayoutSize(dist, start, containerLength),
        length: elementLength,
        end: addPxToLayoutSize(-dist, end, containerLength),
    }
}

function prepareDimension(
    target: Element,
    layout?: LayoutPropTypes,
    relative?: RelativeProps
) {
    const width = layout?.width || defaultLayoutValue.width
    const height = layout?.height || defaultLayoutValue.height
    const left = relative?.left || initialRelativeData.left
    const top = relative?.top || initialRelativeData.top
    const right = relative?.right || initialRelativeData.right
    const bottom = relative?.bottom || initialRelativeData.bottom

    const containerWidth = target.parentElement
        ? target.parentElement.clientWidth
        : window.innerWidth
    const containerHeight = target.parentElement
        ? target.parentElement.clientHeight
        : window.innerHeight
    return {
        width,
        height,
        left,
        top,
        right,
        bottom,
        containerWidth,
        containerHeight,
    }
}

export const FrameChildrenMoveable: ChildrenMoveable = ({
    requestUpdateProps,
    props,
    target,
}) => {
    const relative = props.containerLayoutProps?.relative
    const layout = props.layoutProps
    let lastRelative: RelativeProps | undefined
    let lastLayout: { width: LayoutSize; height: LayoutSize } | undefined
    const ref = useRef<any>()
    ref.current?.retry()
    return (
        <Moveable
            ref={ref}
            resizable
            draggable
            snappable
            snapCenter
            target={target}
            onResize={({ target, dist: [mx, my], direction: [dx, dy] }) => {
                const {
                    left,
                    top,
                    right,
                    bottom,
                    width,
                    height,
                    containerWidth,
                    containerHeight,
                } = prepareDimension(target, layout, relative)

                const {
                    start: nextLeft,
                    end: nextRight,
                    length: nextWidth,
                } = getNewRelativeValue(
                    dx,
                    mx,
                    containerWidth,
                    width,
                    left,
                    right
                )
                const {
                    start: nextTop,
                    end: nextBottom,
                    length: nextHeight,
                } = getNewRelativeValue(
                    dy,
                    my,
                    containerHeight,
                    height,
                    top,
                    bottom
                )
                lastRelative = {
                    left: nextLeft,
                    top: nextTop,
                    right: nextRight,
                    bottom: nextBottom,
                }
                lastLayout = {
                    width: nextWidth,
                    height: nextHeight,
                }
                Object.assign(target.style, {
                    width: layoutSizeToString(nextWidth),
                    height: layoutSizeToString(nextHeight),
                    left: layoutSizeToString(nextLeft),
                    top: layoutSizeToString(nextTop),
                    right: layoutSizeToString(nextRight),
                    bottom: layoutSizeToString(nextBottom),
                })
            }}
            onResizeEnd={(e) => {
                Object.assign(target.style, {
                    width: '',
                    height: '',
                    left: '',
                    top: '',
                    right: '',
                    bottom: '',
                })
                if (lastRelative && lastLayout) {
                    requestUpdateProps({
                        containerLayoutProps: {
                            ...props.containerLayoutProps,
                            relative: lastRelative,
                        },
                        layoutProps: {
                            ...initialData,
                            ...props.layoutProps,
                            ...lastLayout,
                        },
                    })
                }
            }}
            onDrag={({ target, dist: [mx, my] }) => {
                const {
                    left,
                    top,
                    right,
                    bottom,
                    width,
                    height,
                    containerWidth,
                    containerHeight,
                } = prepareDimension(target, layout, relative)
                const {
                    start: nextLeft,
                    end: nextRight,
                    length: nextWidth,
                } = getNewRelativeValue(
                    0,
                    mx,
                    containerWidth,
                    width,
                    left,
                    right
                )
                const {
                    start: nextTop,
                    end: nextBottom,
                    length: nextHeight,
                } = getNewRelativeValue(
                    0,
                    my,
                    containerHeight,
                    height,
                    top,
                    bottom
                )
                lastRelative = {
                    left: nextLeft,
                    top: nextTop,
                    right: nextRight,
                    bottom: nextBottom,
                }
                lastLayout = {
                    width: nextWidth,
                    height: nextHeight,
                }
                Object.assign(target.style, {
                    width: layoutSizeToString(nextWidth),
                    height: layoutSizeToString(nextHeight),
                    left: layoutSizeToString(nextLeft),
                    top: layoutSizeToString(nextTop),
                    right: layoutSizeToString(nextRight),
                    bottom: layoutSizeToString(nextBottom),
                })
            }}
            onDragEnd={() => {
                Object.assign(target.style, {
                    width: '',
                    height: '',
                    left: '',
                    top: '',
                    right: '',
                    bottom: '',
                })
                if (lastRelative && lastLayout) {
                    requestUpdateProps({
                        containerLayoutProps: {
                            ...props.containerLayoutProps,
                            relative: lastRelative,
                        },
                        layoutProps: {
                            ...initialData,
                            ...props.layoutProps,
                            ...lastLayout,
                        },
                    })
                }
            }}
            elementGuidelines={Array.from(target.parentElement?.children ?? [])
                .filter(
                    (v: HTMLElement) =>
                        !v.classList.contains('moveable-control-box') &&
                        v !== target
                )
                .map((v) => {
                    return v
                })}
        ></Moveable>
    )
}
