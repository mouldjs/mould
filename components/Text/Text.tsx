import React, { forwardRef } from 'react'
import * as z from 'zod'
import { ComponentPropTypes } from '../../app/types'
import { RawText } from './RawText'
import { ComponentInspector } from '../../app/Inspectors'
import {
    LayoutInspector,
    LayoutPropTypes,
    transformLayout,
} from '../../inspector/Layout'
import { ShadowsInspector, ShadowsPropTypes } from '../../inspector/Shadows'
import { TextInspector, TextPropTypes } from './Inspector'
import { BlurInspector, BlurPropTypes } from '../../inspector/Blur'
import {
    FiltersInspector,
    FilterPropTypes,
    FilterType,
} from '../../inspector/Filters'
import { transformColorToStr } from '../../inspector/Color'
import { Filter } from '../../standard/common'

type TextProps = {
    layoutProps?: LayoutPropTypes
    shadowsProps?: ShadowsPropTypes
    textProps?: TextPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
}

const initialTextProps: TextPropTypes = {
    content: 'Text',
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
    weight: 500,
    style: 'normal',
    size: 14,
    letterSpacing: 0,
    lineHeight: 1,
    horizontalAlign: 'center',
    verticalAlign: 'middle',
}

const transformTextProps = (textProps: TextPropTypes = initialTextProps) => {
    return {
        content: textProps.content,
        color: transformColorToStr(textProps.color),
        weight: textProps.weight,
        fontStyle: textProps.style,
        size: textProps.size + 'px',
        letterSpacing: textProps.letterSpacing + 'px',
        lineHeight: textProps.lineHeight + '',
        horizontalAlign: textProps.horizontalAlign,
        verticalAlign: textProps.verticalAlign,
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
    textProps,
    blurProps,
    filtersProps,
}: TextProps = {}) => {
    return {
        ...transformLayout(layoutProps),
        ...transformTextProps(textProps!),
        ...(shadowsProps ? transformShadowsProps(shadowsProps) : {}),
        ...transformFilterProps(blurProps, filtersProps),
    }
}

export const Text = forwardRef(
    (
        {
            requestUpdateProps,
            path,
            connectedFields,
            layoutProps,
            shadowsProps,
            textProps = initialTextProps,
            filtersProps,
            blurProps,
            ...rest
        }: ComponentPropTypes & TextProps,
        ref
    ) => {
        const props = transform({
            layoutProps,
            shadowsProps,
            textProps,
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
                        <TextInspector
                            title="Text"
                            data={textProps}
                            onChange={(data) => {
                                requestUpdateProps({ textProps: data })
                            }}
                            connectedFields={connectedFields}
                        ></TextInspector>
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
                <RawText ref={ref} {...props} {...rest}></RawText>
            </>
        )
    }
)
