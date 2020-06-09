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
    shadowsProps?: ShadowsPropTypes
    iconProps?: IconPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
}

const initialIconProps: IconPropTypes = {
    name: 'Star',
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
    size: {
        amount: 100,
        unit: '%',
    },
}

const transformIconProps = (iconProps: IconPropTypes = initialIconProps) => {
    return {
        name: iconProps.name,
        color: transformColorToStr(iconProps.color),
        size: `${iconProps.size.amount}${iconProps.size.unit}`,
    }
}

const transformFilterProps = (
    blurProps?: BlurPropTypes,
    filtersProps?: FilterPropTypes,
    shadowProps?: ShadowsPropTypes
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

    if (shadowProps) {
        const shadowStr = `drop-shadow(${transformShadowsProps(shadowProps)})`
        res.filter = `${shadowStr} ${res.filter || ''}`.trim()
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

    return shadowStr
}

export const transform = ({
    shadowsProps,
    iconProps,
    blurProps,
    filtersProps,
}: IconProps = {}) => {
    return {
        ...transformIconProps(iconProps!),
        ...transformFilterProps(blurProps, filtersProps, shadowsProps),
    }
}

export const Icon = forwardRef(
    (
        {
            requestUpdateProps,
            path,
            connectedFields,
            shadowsProps,
            iconProps = initialIconProps,
            filtersProps,
            blurProps,
            ...rest
        }: ComponentPropTypes & IconProps,
        ref
    ) => {
        const props = transform({
            shadowsProps,
            iconProps,
            blurProps,
            filtersProps,
        })

        return (
            <>
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
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
