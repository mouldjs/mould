import React, { forwardRef } from 'react'
import * as z from 'zod'
import { ComponentPropTypes } from '../../app/types'
import { RawIcon } from './RawIcon'
import { ComponentInspector } from '../../app/Inspectors'
import {
    LayoutInspector,
    LayoutPropTypes,
    transformLayout,
} from '../../inspector/Layout'
import { ShadowsInspector, ShadowsPropTypes } from '../../inspector/Shadows'
import { IconInspector, IconPropTypes } from './Inspector'
import { BlurInspector, BlurPropTypes } from '../../inspector/Blur'
import {
    FiltersInspector,
    FilterPropTypes,
    FilterType,
} from '../../inspector/Filters'
import { transformColorToStr } from '../../inspector/Color'
import { Filter } from '../../standard/common'

type IconProps = {
    layoutProps?: LayoutPropTypes
    shadowsProps?: ShadowsPropTypes
    iconProps?: IconPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
}

const initialIconProps: IconPropTypes = {
    namespace: 'Feather',
    name: 'Star',
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
}

const transformIconProps = (iconProps: IconPropTypes = initialIconProps) => {
    return {
        namespace: iconProps.namespace,
        name: iconProps.name,
        color: transformColorToStr(iconProps.color),
    }
}

const transformFilterProps = (
    blurProps?: BlurPropTypes,
    filtersProps?: FilterPropTypes
) => {
    const res: z.infer<typeof Filter> = {}
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

    return res
}

const transformShadowsProps = (shadowsProps: ShadowsPropTypes) => {
    let shadowStr = ''
    shadowsProps.forEach((shadow) => {
        if (shadow.active) {
            shadowStr = `${shadowStr}${shadowStr ? ' ,' : ''}${shadow.x}px ${
                shadow.y
            }px ${shadow.blur}px ${transformColorToStr(shadow.color)}`
        }
    })

    return {
        shadow: shadowStr,
    }
}

export const transform = ({
    layoutProps,
    shadowsProps,
    iconProps,
    blurProps,
    filtersProps,
}: IconProps = {}) => {
    return {
        ...transformLayout(layoutProps),
        ...transformIconProps(iconProps!),
        ...(shadowsProps ? transformShadowsProps(shadowsProps) : {}),
        ...transformFilterProps(blurProps, filtersProps),
    }
}

export const Icon = forwardRef(
    (
        {
            requestUpdateProps,
            path,
            connectedFields,
            layoutProps,
            shadowsProps,
            iconProps = initialIconProps,
            filtersProps,
            blurProps,
            ...rest
        }: ComponentPropTypes & IconProps,
        ref
    ) => {
        const props = transform({
            layoutProps,
            shadowsProps,
            iconProps,
            blurProps,
            filtersProps,
        })

        return (
            <>
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        <LayoutInspector
                            title="Layout"
                            data={layoutProps}
                            onChange={(data) =>
                                requestUpdateProps({ layoutProps: data })
                            }
                            connectedFields={connectedFields}
                        ></LayoutInspector>
                        <IconInspector
                            title="Icon"
                            data={iconProps}
                            onChange={(data) => {
                                requestUpdateProps({ iconProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></IconInspector>
                        <ShadowsInspector
                            title="Shadows"
                            data={shadowsProps}
                            onChange={(data) =>
                                requestUpdateProps({ shadowsProps: data })
                            }
                            connectedFields={connectedFields}
                            withoutSpread
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
                <RawIcon ref={ref} {...props} {...rest}></RawIcon>
            </>
        )
    }
)
