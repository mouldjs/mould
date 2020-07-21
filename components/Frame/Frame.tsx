import React, { forwardRef } from 'react'
import { ComponentInspector } from '../../app/Inspectors'
import {
    ComponentPropTypes,
    ParentContext,
    ParentContextProps,
} from '../../app/types'
import { BlurInspector, BlurPropTypes } from '../../inspector/Blur'
import {
    BorderInspector,
    BorderPropTypes,
    transformBorderProps,
} from '../../inspector/Border'
import { transformColorToStr } from '../../inspector/Color'
import { FillInspector, FillPropTypes } from '../../inspector/Fill'
import {
    FilterPropTypes,
    FiltersInspector,
    FilterType,
} from '../../inspector/Filters'
import {
    ContainerLayoutProps,
    ContainerRelatedInspectors,
    getPropsFromParent,
} from '../../inspector/InspectorProvider'
import {
    LayoutInspector,
    LayoutPropTypes,
    layoutSizeToString,
    transformLayout,
} from '../../inspector/Layout'
import { ShadowsInspector, ShadowsPropTypes } from '../../inspector/Shadows'
import { StackProps as StandardStackProp } from '../../standard'
import { RawFrame } from './RawFrame'
import { Layout } from '../../standard/common'
import * as z from 'zod'

type StyleProperties = {
    fillProps?: FillPropTypes
    borderProps?: BorderPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
    shadowsProps?: ShadowsPropTypes
    innerShadowsProps?: ShadowsPropTypes
}

type FrameProps = {
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

export const transformChildrenProps = ({
    relative,
}: ContainerLayoutProps): z.infer<typeof Layout> => {
    if (relative) {
        return {
            left: layoutSizeToString(relative.left),
            top: layoutSizeToString(relative.top),
            right: layoutSizeToString(relative.right),
            bottom: layoutSizeToString(relative.bottom),
            position: 'absolute',
        }
    } else {
        return {
            position: 'absolute',
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
        layoutProps,
        containerLayoutProps = {},
    }: StyleProperties & FrameProps = {},
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
        ...transformLayout(layoutProps),
        ...getPropsFromParent(context, containerLayoutProps),
    }
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
            layoutProps,
            containerLayoutProps,
            parent,
            ...rest
        }: ComponentPropTypes &
            StyleProperties &
            FrameProps &
            ParentContextProps,
        ref
    ) => {
        const style = transform(
            {
                fillProps,
                borderProps,
                blurProps,
                filtersProps,
                shadowsProps,
                innerShadowsProps,
                layoutProps,
                containerLayoutProps,
            },
            parent
        )

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

                <RawFrame ref={ref as any} {...style} {...rest}>
                    {children}
                </RawFrame>
            </>
        )
    }
)
