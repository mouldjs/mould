import React, { forwardRef } from 'react'
import * as z from 'zod'
import { ComponentPropTypes } from '../../app/types'
import { RawInput } from './RawInput'
import { ComponentInspector } from '../../app/Inspectors'
import {
    LayoutInspector,
    LayoutPropTypes,
    transformLayout,
} from '../../inspector/Layout'
import { ShadowsInspector, ShadowsPropTypes } from '../../inspector/Shadows'
import { InputInspector, InputPropTypes } from './Inspector'
import { BlurInspector, BlurPropTypes } from '../../inspector/Blur'
import {
    FiltersInspector,
    FilterPropTypes,
    FilterType,
} from '../../inspector/Filters'
import { transformColorToStr } from '../../inspector/Color'
import { Filter } from '../../standard/common'

type InputProps = {
    layoutProps?: LayoutPropTypes
    shadowsProps?: ShadowsPropTypes
    InputProps?: InputPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
}

const initialInputProps: InputPropTypes = {
    value: '',
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
    size: 14,
}

const transformInputProps = (
    InputProps: InputPropTypes = initialInputProps
) => {
    return {
        value: InputProps.value,
        color: transformColorToStr(InputProps.color),
        size: InputProps.size + 'px',
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
    InputProps,
    blurProps,
    filtersProps,
}: InputProps = {}) => {
    return {
        ...transformLayout(layoutProps),
        ...transformInputProps(InputProps!),
        ...(shadowsProps ? transformShadowsProps(shadowsProps) : {}),
        ...transformFilterProps(blurProps, filtersProps),
    }
}

export const Input = forwardRef(
    (
        {
            requestUpdateProps,
            path,
            connectedFields,
            layoutProps,
            shadowsProps,
            InputProps = initialInputProps,
            filtersProps,
            blurProps,
            ...rest
        }: ComponentPropTypes & InputProps,
        ref
    ) => {
        const props = transform({
            layoutProps,
            shadowsProps,
            InputProps,
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
                        <InputInspector
                            title="Input"
                            data={InputProps}
                            onChange={(data) => {
                                requestUpdateProps({ InputProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></InputInspector>
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
                <RawInput ref={ref} {...props} {...rest}></RawInput>
            </>
        )
    }
)
