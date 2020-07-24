import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import { ChildrenMoveable, EditorState } from '../../app/types'
import { useSelector } from 'react-redux'
import {
    LayoutSize,
    LayoutPropTypes,
    layoutSizeToString,
    initialData,
} from '../../inspector/Layout'
import { FlexProps } from '../../inspector/InspectorProvider'
import { MoveableProps } from 'react-moveable/declaration/types'
import { initialFlexData } from './Inspector'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
}) as React.ComponentType<MoveableProps & { ref: any }>

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

export const StackChildrenMoveable: ChildrenMoveable = ({
    requestUpdateProps,
    props,
    target,
}) => {
    const flex = props.containerLayoutProps?.flex
    const layout = props.layoutProps
    const workspaceZoom =
        useSelector((state: EditorState) => state.testWorkspace.zoom) || 1

    let lastFlex: FlexProps | undefined
    let lastLayout: { width: LayoutSize; height: LayoutSize } | undefined

    const ref = useRef<any>()
    ref.current?.retry()
    return (
        <Moveable
            ref={ref}
            zoom={1 / workspaceZoom}
            resizable
            draggable
            snappable
            snapCenter
            target={target}
            onResize={({ target, dist: [mx, my], direction: [dx, dy] }) => {
                const {
                    width,
                    height,
                    containerWidth,
                    containerHeight,
                } = prepareDimension(target, layout, flex)
                const nextWidth = addPxToLayoutSize(mx, width, containerWidth)
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
            elementGuidelines={Array.from(target.parentElement?.children ?? [])
                .filter(
                    (v: HTMLElement) =>
                        !v.classList.contains('moveable-control-box') &&
                        v !== target
                )
                .map((v) => {
                    console.log(v)
                    return v
                })}
        ></Moveable>
    )
}
