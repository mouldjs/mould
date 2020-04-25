import React, { forwardRef, CSSProperties } from 'react'
import { ComponentInspector } from '../../app/Inspectors'
import * as z from 'zod'
import { ComponentPropTypes, zodComponentProps } from '../../app/types'
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
    StackAlignment,
} from './Inspector'
import { LayoutPropTypes, LayoutInspector } from '../../inspector/Layout'
import { nameToParam } from '../../app/utils'
import { initialData } from './Inspector'
import { RawStack } from './RawStack'
import { FillInspector, FillPropTypes } from '../../inspector/Fill'

const Direction = z.union([
    z.literal('column'),
    z.literal('row'),
    z.literal('column-reverse'),
    z.literal('row-reverse'),
])

const Alignment = z.union([
    z.literal('flex-start'),
    z.literal('flex-end'),
    z.literal('center'),
    z.literal('space-between'),
    z.literal('space-around'),
    z.literal('space-evenly'),
    z.literal('baseline'),
    z.literal('stretch'),
])

export const stackProps = z
    .object({
        direction: Direction.optional(),
        horizontalAlign: Alignment.optional(),
        verticalAlign: Alignment.optional(),
        wrap: z.boolean().optional(),
        grow: z.boolean().optional(),
        shrink: z.boolean().optional(),
    })
    .merge(zodComponentProps)

type StyleProperties = {
    fillProps?: FillPropTypes
    borderProps?: BorderPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
    shadowsProps?: ShadowsPropTypes
    innerShadowsProps?: ShadowsPropTypes
}

type StackProps = {
    stackProps?: StackPropTypes
    layoutProps?: LayoutPropTypes
}

const transformStyles = ({
    fillProps,
    borderProps,
    blurProps,
    filtersProps,
    shadowsProps,
    innerShadowsProps,
}: StyleProperties) => {
    let res: CSSProperties = {}
    if (fillProps && fillProps.active) {
        res = { ...res, background: transformColorToStr(fillProps.color) }
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
        res.boxShadow = shadowStr
    }

    return res
}

const mapDistribution: {
    [distribution in StackDistribution]: string
} = {
    Start: 'flex-start',
    Center: 'center',
    End: 'flex-end',
    'Space Between': 'space-between',
    'Space Around': 'space-around',
    'Space Evenly': 'space-evenly',
}

const mapAlignment: {
    [alignment in StackAlignment]: string
} = {
    Start: 'flex-start',
    Center: 'center',
    End: 'flex-end',
}

const transformStackContent = ({
    direction,
    distribute,
    alignment,
    gap,
    padding,
    active,
}: StackPropTypes) => {
    const paddingParam =
        typeof padding === 'object'
            ? {
                  paddingTop: padding.t,
                  paddingRight: padding.r,
                  paddingBottom: padding.b,
                  paddingLeft: padding.l,
              }
            : {
                  padding,
              }

    return {
        ...paddingParam,
        flexDirection: direction === 'Vertical' ? 'column' : 'row',
        justifyContent: mapDistribution[distribute],
        alignItems: mapAlignment[alignment],
        // gap,
    }
}

const transformLayout = ({
    width,
    height,
    lockProportion,
    overflow,
    opacity,
    rotation,
    radius,
}: LayoutPropTypes) => {
    const radiusStr =
        typeof radius === 'object'
            ? `${radius.t}px ${radius.r}px ${radius.b}px ${radius.l}px`
            : `${radius}px`

    return {
        width: `${width.amount}${width.unit}`,
        height: `${height.amount}${height.unit}`,
        overflow: nameToParam(overflow),
        opacity: `${opacity}%`,
        rotate: rotation,
        borderRadius: radiusStr,
    } as any
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
            ...rest
        }: ComponentPropTypes & StyleProperties & StackProps,
        ref
    ) => {
        return (
            <>
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
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
                <RawStack
                    ref={ref as any}
                    style={{
                        ...transformStyles({
                            fillProps,
                            borderProps,
                            blurProps,
                            filtersProps,
                            shadowsProps,
                            innerShadowsProps,
                        }),
                        ...transformStackContent(stackProps || initialData),
                        ...transformLayout(
                            layoutProps || {
                                width: {
                                    amount: 100,
                                    unit: '%',
                                },
                                height: {
                                    amount: 100,
                                    unit: '%',
                                },
                                lockProportion: false,
                                overflow: 'Visible',
                                opacity: 100,
                                rotation: 0,
                                radius: 0,
                            }
                        ),
                        display: 'flex',
                    }}
                    {...rest}
                >
                    {children}
                </RawStack>
            </>
        )
    }
)
