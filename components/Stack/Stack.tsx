import React, { forwardRef, SFC } from 'react'
import * as z from 'zod'
import { ComponentInspector } from '../../app/Inspectors'
import {
    ComponentPropTypes,
    ParentContext,
    ParentContextProps,
    Path,
    Component,
} from '../../app/types'
import {
    BorderInspector,
    BorderPropTypes,
    transformBorderProps,
} from '../../inspector/Border'
import { BlurInspector, BlurPropTypes } from '../../inspector/Blur'
import {
    FiltersInspector,
    FilterPropTypes,
    FilterType,
} from '../../inspector/Filters'
import { ShadowsPropTypes, ShadowsInspector } from '../../inspector/Shadows'
import { transformColorToStr } from '../../inspector/Color'
import {
    StackPropTypes,
    StackInspector,
    StackDistribution,
    StackDirection,
} from './Inspector'
import {
    LayoutPropTypes,
    LayoutInspector,
    transformLayout,
} from '../../inspector/Layout'
import { nameToParam } from '../../app/utils'
import { initialData } from './Inspector'
import { RawStack } from './RawStack'
import { FillInspector, FillPropTypes } from '../../inspector/Fill'
import { StackProps as StandardStackProp } from '../../standard'
import { StackSpecific, FlexDirection } from '../../standard/stack'
import {
    ContainerLayoutProps,
    ContainerRelatedInspectors,
    getPropsFromParent,
} from '../../inspector/InspectorProvider'
import { Layout } from '../../standard/common'
import styled, { css } from 'styled-components'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { insertComponentOnPath } from '../../app/appShell'

type StyleProperties = {
    fillProps?: FillPropTypes
    borderProps?: BorderPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
    shadowsProps?: ShadowsPropTypes
    innerShadowsProps?: ShadowsPropTypes
}

export type StackProps = {
    stackProps?: StackPropTypes
    layoutProps?: LayoutPropTypes
    containerLayoutProps?: ContainerLayoutProps
}

const transformStyles = ({
    fillProps,
    borderProps,
    blurProps,
    filtersProps,
    shadowsProps,
    innerShadowsProps,
}: StyleProperties) => {
    let res: StandardStackProp = {}
    if (fillProps && fillProps.active) {
        res = { ...res, fill: transformColorToStr(fillProps.color) }
    }
    if (borderProps) {
        res = { ...res, ...transformBorderProps(borderProps) }
    }
    if (filtersProps) {
        let filterStr = ''
        Object.keys(filtersProps).forEach((filterType: FilterType) => {
            const filterData = filtersProps[filterType]!
            if (filterData.active) {
                filterStr = `${filterStr} ${filterType
                    .toLowerCase()
                    .split(' ')
                    .join('-')}(${filterData.amount}${filterData.unit})`
            }
        })
        res.filter = filterStr.trim()
    }
    if (blurProps && blurProps.active) {
        const blurStr = `blur(${blurProps.blurAmount}${blurProps.unit})`
        if (blurProps.blurStyle === 'Background') {
            res.backdropFilter = blurStr
        } else {
            res.filter = `${blurStr} ${res.filter || ''}`.trim()
        }
    }
    let shadowStr = ''
    const handleShadow = (shadows: ShadowsPropTypes, inset: boolean) => {
        shadows.forEach((shadow) => {
            if (shadow.active) {
                shadowStr = `${shadowStr}${shadowStr ? ' ,' : ''}${
                    inset ? 'inset ' : ''
                }${shadow.x}px ${shadow.y}px ${shadow.blur}px ${
                    shadow.spread
                }px ${transformColorToStr(shadow.color)}`
            }
        })
    }
    if (shadowsProps) {
        handleShadow(shadowsProps, false)
    }
    if (innerShadowsProps) {
        handleShadow(innerShadowsProps, true)
    }
    if (shadowStr) {
        res.shadow = shadowStr
    }

    return res
}

const mapDistribution: {
    [distribution in StackDistribution]:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
} = {
    Start: 'flex-start',
    Center: 'center',
    End: 'flex-end',
    'Space Between': 'space-between',
    'Space Around': 'space-around',
    'Space Evenly': 'space-evenly',
}

enum mapAlignment {
    Start = 'flex-start',
    Center = 'center',
    End = 'flex-end',
}

const transformDirection = (
    direction: StackDirection
): z.infer<typeof FlexDirection> => {
    switch (direction) {
        case 'Horizontal':
            return 'row'
        case 'HorizontalReverse':
            return 'row-reverse'
        case 'Vertical':
            return 'column'
        case 'VerticalReverse':
            return 'column-reverse'
    }
}

const transformStackContent = ({
    direction,
    distribute,
    alignment,
    gap,
    padding,
    active,
}: StackPropTypes = initialData): z.infer<typeof StackSpecific> => {
    const paddingParam =
        typeof padding === 'object'
            ? {
                  paddingTop: padding.t + '',
                  paddingRight: padding.r + '',
                  paddingBottom: padding.b + '',
                  paddingLeft: padding.l + '',
              }
            : {
                  padding: padding + '',
              }

    return {
        ...paddingParam,
        flexDirection: transformDirection(direction),
        justifyContent: mapDistribution[distribute],
        alignItem: mapAlignment[alignment],
        gap: gap + 'px',
    }
}

export const transformChildrenStyle = ({
    flex,
}: ContainerLayoutProps = {}): z.infer<typeof Layout> => {
    if (flex) {
        return {
            position: 'relative',
            flexGrow: flex.grow.toString(),
            flexShrink: flex.shrink.toString(),
        }
    } else {
        return {
            position: 'relative',
        }
    }
}

export const transform = (
    {
        fillProps,
        borderProps,
        blurProps,
        filtersProps,
        shadowsProps,
        innerShadowsProps,
        stackProps,
        layoutProps,
        containerLayoutProps = {},
    }: StyleProperties & StackProps = {},
    context?: ParentContext
) => {
    return {
        ...transformStyles({
            fillProps,
            borderProps,
            blurProps,
            filtersProps,
            shadowsProps,
            innerShadowsProps,
        }),
        ...transformStackContent(stackProps),
        ...transformLayout(layoutProps),
        ...getPropsFromParent(context, containerLayoutProps),
    }
}

const getFlexDirectionForGap = (
    stackDirection: StackDirection | undefined
): 'row' | 'column' => {
    if (stackDirection === 'Vertical' || stackDirection === 'VerticalReverse') {
        return 'row'
    }
    if (
        stackDirection === 'Horizontal' ||
        stackDirection === 'HorizontalReverse'
    ) {
        return 'column'
    }
    return 'column'
}

const Gap: SFC<
    StackProps & { ref: any; canDrop: boolean; isOver: boolean }
> = styled.div.attrs<
    StackProps & { ref: any; canDrop: boolean; isOver: boolean }
>((props) => {
    let height = '100%'
    let width = '100%'
    let left = '0'
    let top = '0'
    const direction = getFlexDirectionForGap(props.stackProps?.direction)
    if (direction === 'column') {
        width = props.canDrop ? '20px' : '0'
        left = '-10px'
    }
    if (direction === 'row') {
        height = props.canDrop ? '20px' : '0'
        top = '-10px'
    }
    return { ...props, width, height, left, top, direction }
})<
    StackProps & {
        width: string
        height: string
        left: string
        top: string
        canDrop: boolean
        isOver: boolean
        direction: string
    }
>`
    position: absolute;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    left: ${({ left }) => left};
    top: ${({ top }) => top};
    flex-direction: ${({ direction }) => direction};
    justify-content: space-between;
    align-items: center;
    display: flex;
    z-index: 1000;
`

const GapContainer = styled.div({
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
    margin: '0',
})

const GapNotifer = styled.div({
    width: '7px',
    height: '7px',
    borderRadius: '7px',
    border: 'solid 1px #4488ff',
    background: 'white',
    flexGrow: 0,
    flexShrink: 0,
})
const GapLine = styled.div<{ direction: 'row' | 'column' }>`
    flex-grow: 1;
    background: #4488ff;
    ${(props) =>
        props.direction === 'row'
            ? css`
                  height: 1px;
              `
            : css`
                  width: 1px;
              `}
`

const StackGap: SFC<
    StackProps & { path?: Path; isOver: boolean; index: number }
> = ({ path, isOver: parentOver, index, ...rest }) => {
    const dispatch = useDispatch()
    let [{ canDrop, isOver }, drop] = useDrop<
        { type: string; name: string; props?: object; children?: Component[] },
        void,
        { canDrop: boolean; isOver: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            if (path) {
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
                            index,
                        })
                    )
            }
        },
        collect: (monitor) => {
            let canDrop = false
            let isOver = false
            try {
                canDrop = monitor.canDrop()
                isOver = monitor.isOver({ shallow: true })
            } catch (e) {}

            return {
                canDrop,
                isOver,
            }
        },
    })

    let height = '100%'
    let width = '100%'
    const direction = getFlexDirectionForGap(rest.stackProps?.direction)
    if (direction === 'column') {
        width = '0'
    }
    if (direction === 'row') {
        height = '0'
    }
    canDrop = true
    return (
        <GapContainer style={{ width, height }}>
            <Gap
                {...rest}
                ref={drop}
                canDrop={canDrop && (parentOver || isOver)}
                isOver={isOver}
            >
                {isOver ? (
                    <>
                        <GapNotifer></GapNotifer>
                        <GapLine direction={direction}></GapLine>
                        <GapNotifer></GapNotifer>
                    </>
                ) : null}
            </Gap>
        </GapContainer>
    )
}

export default forwardRef(
    (
        {
            requestUpdateProps,
            children,
            path,
            connectedFields,
            fillProps,
            borderProps,
            blurProps,
            filtersProps,
            shadowsProps,
            innerShadowsProps,
            stackProps,
            layoutProps,
            containerLayoutProps,
            parent,
            isOver,
            ...rest
        }: ComponentPropTypes &
            StyleProperties &
            StackProps &
            ParentContextProps & { isOver: boolean },
        ref
    ) => {
        let [{ canDrop }, drop] = useDrop<
            {
                type: string
                name: string
                props?: object
                children?: Component[]
            },
            void,
            { canDrop: boolean }
        >({
            accept: 'TREE',
            drop: (item, monitor) => {},
            collect: (monitor) => {
                let canDrop = false
                try {
                    canDrop = monitor.canDrop()
                } catch (e) {}

                return {
                    canDrop,
                }
            },
        })
        const style = transform(
            {
                fillProps,
                borderProps,
                blurProps,
                filtersProps,
                shadowsProps,
                innerShadowsProps,
                stackProps,
                layoutProps,
                containerLayoutProps,
            },
            parent
        )

        const gapCount = (children?.length ?? 0) + 1
        const insertedChildren: JSX.Element[] = []

        if (canDrop) {
            for (let i = 0; i < gapCount; i++) {
                insertedChildren.push(
                    <StackGap
                        stackProps={stackProps}
                        layoutProps={layoutProps}
                        path={path}
                        isOver={isOver}
                        index={i}
                        key={'gap' + i}
                    ></StackGap>
                )
                if (i < (children?.length ?? 0)) {
                    insertedChildren.push(
                        (children![i] as unknown) as JSX.Element
                    )
                }
            }
        } else {
            children?.forEach((v) => insertedChildren.push(v as any))
        }

        return (
            <>
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        <ContainerRelatedInspectors
                            parent={parent}
                            data={containerLayoutProps || {}}
                            onChange={(data) => {
                                requestUpdateProps({
                                    containerLayoutProps: data,
                                })
                            }}
                        ></ContainerRelatedInspectors>
                        <LayoutInspector
                            title="Layout"
                            data={layoutProps}
                            onChange={(data) => {
                                requestUpdateProps({ layoutProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></LayoutInspector>
                        <StackInspector
                            title="Stack"
                            data={stackProps}
                            onChange={(data) => {
                                requestUpdateProps({ stackProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></StackInspector>
                        <FillInspector
                            title="Fill"
                            data={fillProps}
                            onChange={(data) => {
                                requestUpdateProps({ fillProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></FillInspector>
                        <BorderInspector
                            data={borderProps}
                            onChange={(data) => {
                                requestUpdateProps({ borderProps: data })
                            }}
                            title="Border"
                            connectedFields={connectedFields}
                        ></BorderInspector>
                        <ShadowsInspector
                            title="Shadows"
                            data={shadowsProps}
                            onChange={(data) => {
                                requestUpdateProps({ shadowsProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></ShadowsInspector>
                        <ShadowsInspector
                            title="Inner Shadows"
                            data={innerShadowsProps}
                            onChange={(data) => {
                                requestUpdateProps({ innerShadowsProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></ShadowsInspector>
                        <BlurInspector
                            title="Blur"
                            data={blurProps}
                            onChange={(data) => {
                                requestUpdateProps({ blurProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></BlurInspector>
                        <FiltersInspector
                            data={filtersProps}
                            title="Filters"
                            onChange={(data) => {
                                requestUpdateProps({ filtersProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></FiltersInspector>
                    </ComponentInspector>
                )}
                <RawStack ref={ref as any} {...style} {...rest}>
                    {insertedChildren}
                </RawStack>
            </>
        )
    }
)
