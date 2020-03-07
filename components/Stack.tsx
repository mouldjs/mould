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
import { ComponentPropTypes } from '../app/types'
import {
    ArrowLeft,
    ArrowRight,
    ArrowDown,
    ArrowUp,
    Sliders,
} from 'react-feather'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { BaseFlex } from './BaseComponents'

const ToggleButton = OToggleButton as any

type Alignment =
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'baseline'
    | 'stretch'

type StackProps = {
    direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
    horizontalAlign?: Alignment
    verticalAlign?: Alignment
    wrap?: boolean
    grow?: boolean
    shrink?: boolean
}

const alignments: Alignment[] = [
    'flex-start',
    'flex-end',
    'center',
    'baseline',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
]

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
        }: ComponentPropTypes & StackProps,
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
                {...rest}
            >
                {children}
                <ComponentInspector path={path}>
                    <TitledBoard
                        title="Stack"
                        collspae
                        renderTitle={collspaed => {
                            if (collspaed) {
                                return null
                            }

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
                                onChange={value => {
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
                                onChange={value => {
                                    requestUpdateProps({ verticalAlign: value })
                                }}
                            >
                                <Flex flexWrap="wrap">
                                    {alignments.map(alignment => (
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
                                onChange={value => {
                                    requestUpdateProps({
                                        horizontalAlign: value,
                                    })
                                }}
                            >
                                <Flex flexWrap="wrap">
                                    {alignments.map(alignment => (
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
                                onChange={e =>
                                    requestUpdateProps({
                                        grow: e.target.checked,
                                    })
                                }
                            >
                                Grow
                            </Checkbox>
                            <Checkbox
                                checked={shrink}
                                onChange={e =>
                                    requestUpdateProps({
                                        shrink: e.target.checked,
                                    })
                                }
                            >
                                Shrink
                            </Checkbox>
                            <Checkbox
                                checked={wrap}
                                onChange={e =>
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
            </BaseFlex>
        )
    }
)
