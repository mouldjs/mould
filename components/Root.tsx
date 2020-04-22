import React, { useState, useRef, forwardRef } from 'react'
import { ComponentInspector } from '../app/Inspectors'
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
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { BaseFlex } from './BaseComponents'
import { GeneralStyleInspector } from './GeneralStyleInspector'
import { CSSInspector } from './CSSInspector'
import * as z from 'zod'
import { ComponentPropTypes, zodComponentProps } from '../app/types'

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

const alignments = Array.from(Alignment._def.options).map((a) => a._def.value)

export const rootProps = z
    .object({
        direction: Direction.optional(),
        horizontalAlign: Alignment.optional(),
        verticalAlign: Alignment.optional(),
        wrap: z.boolean().optional(),
        grow: z.boolean().optional(),
        shrink: z.boolean().optional(),
    })
    .merge(zodComponentProps)

type PropType = z.TypeOf<typeof rootProps>

const ToggleButton = OToggleButton as any

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
            ...rest
        }: ComponentPropTypes & PropType,
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
                // style={style}
                {...rest}
            >
                {children}
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        <TitledBoard
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
                        </TitledBoard>
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
