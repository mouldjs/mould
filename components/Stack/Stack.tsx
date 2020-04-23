import React, { useState, useRef, forwardRef, CSSProperties } from 'react'
import { ComponentInspector } from '../../app/Inspectors'
import {
    Input,
    ToggleButton as OToggleButton,
    ToggleButtonGroup,
    Flex,
    Box,
    Popover,
    Checkbox,
} from '@modulz/radix'
import {
    ArrowLeft,
    ArrowRight,
    ArrowDown,
    ArrowUp,
    Sliders,
    Props,
} from 'react-feather'
import { Cell, TitledBoard } from '../../inspector/FormComponents'
import { BaseFlex } from '../BaseComponents'
import { GeneralStyleInspector } from '../GeneralStyleInspector'
import { CSSInspector } from '../CSSInspector'
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
import { StackPropTypes, StackInspector } from './Inspector'
import { LayoutPropTypes, LayoutInspector } from '../../inspector/Layout'

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

type PropType = z.TypeOf<typeof stackProps>

const ToggleButton = OToggleButton as any

const alignments = Array.from(Alignment._def.options).map((a) => a._def.value)

type StyleProperties = {
    borderProps?: BorderPropTypes
    blurProps?: BlurPropTypes
    filtersProps?: FilterPropTypes
    shadowsProps?: ShadowsPropTypes
    innerShadowsProps?: ShadowsPropTypes
}

type StackProperties = {
    stackProps?: StackPropTypes
    layoutProps?: LayoutPropTypes
}

const transformStyles = ({
    borderProps,
    blurProps,
    filtersProps,
    shadowsProps,
    innerShadowsProps,
}: StyleProperties) => {
    let res: CSSProperties = {}
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

export default forwardRef(
    (
        {
            requestUpdateProps,
            children,
            path,
            direction = 'column',
            horizontalAlign = 'flex-start',
            verticalAlign = 'flex-start',
            wrap = false,
            grow = true,
            shrink = true,
            borderProps,
            blurProps,
            filtersProps,
            shadowsProps,
            innerShadowsProps,
            stackProps,
            layoutProps,
            ...rest
        }: ComponentPropTypes & PropType & StyleProperties & StackProperties,
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const buttonRef = useRef(null)

        return (
            <BaseFlex
                flexDirection={direction}
                justifyContent={verticalAlign}
                alignItems={horizontalAlign}
                flexWrap={wrap && 'wrap'}
                flexGrow={grow && 1}
                flexShrink={shrink && 1}
                ref={ref}
                height="100%"
                width="100%"
                style={transformStyles({
                    borderProps,
                    blurProps,
                    filtersProps,
                    shadowsProps,
                    innerShadowsProps,
                })}
                // style={style}
                {...rest}
            >
                {children}
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        {/* <TitledBoard
                            title="Stack"
                            renderTitle={() => {
                                return (
                                    <div ref={buttonRef}>
                                        <Sliders
                                            size={14}
                                            color="#959595"
                                            onClick={() => {
                                                setIsOpen(true)
                                            }}
                                        ></Sliders>
                                    </div>
                                )
                            }}
                        >
                            <Cell label="Direction" desc="Flex direction">
                                <ToggleButtonGroup
                                    value={direction}
                                    onChange={(value) => {
                                        requestUpdateProps({ direction: value })
                                    }}
                                >
                                    <ToggleButton value="column">
                                        <ArrowDown size={12}></ArrowDown>
                                    </ToggleButton>
                                    <ToggleButton value="row">
                                        <ArrowRight size={12}></ArrowRight>
                                    </ToggleButton>
                                    <ToggleButton value="column-reverse">
                                        <ArrowUp size={12}></ArrowUp>
                                    </ToggleButton>
                                    <ToggleButton value="row-reverse">
                                        <ArrowLeft size={12}></ArrowLeft>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Cell>
                            <Cell label="Vertical align">
                                <ToggleButtonGroup
                                    value={verticalAlign}
                                    onChange={(value) => {
                                        requestUpdateProps({
                                            verticalAlign: value,
                                        })
                                    }}
                                >
                                    <Flex flexWrap="wrap">
                                        {alignments.map((alignment) => (
                                            <ToggleButton
                                                key={alignment}
                                                style={{
                                                    minWidth: 40,
                                                    marginBottom: 12,
                                                }}
                                                value={alignment}
                                            >
                                                {alignment}
                                            </ToggleButton>
                                        ))}
                                    </Flex>
                                </ToggleButtonGroup>
                            </Cell>
                            <Cell label="Horizontal align">
                                <ToggleButtonGroup
                                    value={horizontalAlign}
                                    onChange={(value) => {
                                        requestUpdateProps({
                                            horizontalAlign: value,
                                        })
                                    }}
                                >
                                    <Flex flexWrap="wrap">
                                        {alignments.map((alignment) => (
                                            <ToggleButton
                                                key={alignment}
                                                style={{
                                                    minWidth: 40,
                                                    marginBottom: 12,
                                                    zIndex: 0,
                                                }}
                                                value={alignment}
                                            >
                                                {alignment}
                                            </ToggleButton>
                                        ))}
                                    </Flex>
                                </ToggleButtonGroup>
                            </Cell>
                        </TitledBoard> */}
                        <LayoutInspector
                            title="Layout"
                            data={layoutProps}
                            onChange={(data) => {
                                requestUpdateProps({ layoutProps: data })
                            }}
                        ></LayoutInspector>
                        <StackInspector
                            title="Stack"
                            data={stackProps}
                            onChange={(data) => {
                                requestUpdateProps({ stackProps: data })
                            }}
                        ></StackInspector>
                        <BorderInspector
                            data={borderProps}
                            onChange={(data) => {
                                requestUpdateProps({ borderProps: data })
                            }}
                        ></BorderInspector>
                        <ShadowsInspector
                            title="Shadows"
                            data={shadowsProps}
                            onChange={(data) => {
                                requestUpdateProps({ shadowsProps: data })
                            }}
                        ></ShadowsInspector>
                        <ShadowsInspector
                            title="Inner Shadows"
                            data={innerShadowsProps}
                            onChange={(data) => {
                                requestUpdateProps({ innerShadowsProps: data })
                            }}
                        ></ShadowsInspector>
                        <BlurInspector
                            data={blurProps}
                            onChange={(data) => {
                                requestUpdateProps({ blurProps: data })
                            }}
                        ></BlurInspector>
                        <FiltersInspector
                            data={filtersProps}
                            onChange={(data) => {
                                requestUpdateProps({ filtersProps: data })
                            }}
                        ></FiltersInspector>
                        <CSSInspector
                            style={rest}
                            requestUpdateProps={requestUpdateProps}
                        ></CSSInspector>
                        {/* <GeneralStyleInspector
                        style={rest}
                        requestUpdateProps={requestUpdateProps}
                    ></GeneralStyleInspector> */}
                        <Popover
                            targetRef={buttonRef}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            side="bottom"
                            align="end"
                            style={{ zIndex: 10000 }}
                        >
                            <Flex
                                padding={12}
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Checkbox
                                    checked={grow}
                                    onChange={(e) =>
                                        requestUpdateProps({
                                            grow: e.target.checked,
                                        })
                                    }
                                >
                                    Grow
                                </Checkbox>
                                <Checkbox
                                    checked={shrink}
                                    onChange={(e) =>
                                        requestUpdateProps({
                                            shrink: e.target.checked,
                                        })
                                    }
                                >
                                    Shrink
                                </Checkbox>
                                <Checkbox
                                    checked={wrap}
                                    onChange={(e) =>
                                        requestUpdateProps({
                                            wrap: e.target.checked,
                                        })
                                    }
                                >
                                    Wrap
                                </Checkbox>
                            </Flex>
                        </Popover>
                    </ComponentInspector>
                )}
            </BaseFlex>
        )
    }
)
