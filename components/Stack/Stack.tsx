import React, {
    forwardRef,
    CSSProperties,
    useEffect,
    createContext,
} from 'react'
import * as z from 'zod'
import { ComponentInspector } from '../../app/Inspectors'
import { ComponentPropTypes } from '../../app/types'
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
    StackChildrenInspectorRenderer,
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
import { StackSpecific } from '../../standard/stack'
import {
    ChildrenLayoutInspectorProvider,
    ContainerLayoutProps,
    ContainerRelatedInspectors,
    useLayoutProps,
} from '../ContainerRelatedInspector/InspectorProvider'

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
): z.infer<typeof StackSpecific>['flexDirection'] => {
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
        // gap,
    }
}

const transformChildrenStyle = ({
    flex,
}: ContainerLayoutProps): CSSProperties => {
    if (flex) {
        return {
            flexGrow: flex.grow,
            flexShrink: flex.shrink,
        }
    } else {
        return {}
    }
}

export const transform = ({
    fillProps,
    borderProps,
    blurProps,
    filtersProps,
    shadowsProps,
    innerShadowsProps,
    stackProps,
    layoutProps,
    containerLayoutProps = {},
}: StyleProperties & StackProps = {}) => {
    const styleFromContainer = useLayoutProps(containerLayoutProps)
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
        ...styleFromContainer,
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
            stackProps,
            layoutProps,
            containerLayoutProps = {},
            ...rest
        }: ComponentPropTypes & StyleProperties & StackProps,
        ref
    ) => {
        const style = transform({
            fillProps,
            borderProps,
            blurProps,
            filtersProps,
            shadowsProps,
            innerShadowsProps,
            stackProps,
            layoutProps,
            containerLayoutProps,
        })

        return (
            <>
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        <ContainerRelatedInspectors
                            data={containerLayoutProps || {}}
                            onChange={(data) => {
                                console.log(data)
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
                <ChildrenLayoutInspectorProvider
                    transform={transformChildrenStyle}
                    renderer={StackChildrenInspectorRenderer}
                >
                    <RawStack ref={ref as any} {...style} {...rest}>
                        {children}
                    </RawStack>
                </ChildrenLayoutInspectorProvider>
            </>
        )
    }
)
