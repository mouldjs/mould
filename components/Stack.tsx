import React, { useState, useRef } from 'react'
import PropSource from '../app/PropSource'
import {
    Input,
    Flex,
    ToggleButton,
    ToggleButtonGroup,
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
import { Cell, TitledBoard } from './FormComponents'

type Alignment =
    | 'start'
    | 'end'
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
    gap?: number | string
    grow?: boolean
    shrink?: boolean
}

const alignments: Alignment[] = [
    'start',
    'end',
    'center',
    'baseline',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
]

export default ({
    requestUpdateProps,
    children,
    path,
    direction = 'column',
    horizontalAlign = 'start',
    verticalAlign = 'start',
    wrap = false,
    gap = 0,
    grow = true,
    shrink = true,
}: ComponentPropTypes<StackProps>) => {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef(null)

    return (
        <Flex
            flexDirection={direction}
            justifyContent={verticalAlign}
            alignItems={horizontalAlign}
            flexWrap={wrap && 'wrap'}
            flexGrow={grow && 1}
            flexShrink={shrink && 1}
            width={direction.includes('column') ? '100%' : 'fill-available'}
            height={direction.includes('row') ? '100%' : 'fill-available'}
        >
            {children &&
                children.map((c, index) => {
                    const first = index === 0
                    const s = {
                        flexGrow: 1,
                        width: 'fill-available',
                        height: 'fill-available',
                    }

                    return first ? (
                        <Box {...s}>{c}</Box>
                    ) : direction.includes('column') ? (
                        <Box {...s} mt={gap}>
                            {c}
                        </Box>
                    ) : (
                        <Box {...s} ml={gap}>
                            {c}
                        </Box>
                    )
                })}
            <PropSource path={path}>
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
                                requestUpdateProps({ horizontalAlign: value })
                            }}
                        >
                            <Flex flexWrap="wrap">
                                {alignments.map(alignment => (
                                    <ToggleButton
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
                    <Cell label="Gap">
                        <Input
                            value={gap}
                            onChange={e => {
                                const gap = parseInt(e.target.value)
                                if (gap || gap === 0) {
                                    requestUpdateProps({ gap })
                                }
                            }}
                        ></Input>
                    </Cell>
                </TitledBoard>
                <Popover
                    targetRef={buttonRef}
                    isOpen={isOpen}
                    onDismiss={() => setIsOpen(false)}
                    side="bottom"
                    align="end"
                    css={{ zIndex: 10000 }}
                >
                    <Flex
                        padding={12}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Checkbox
                            checked={grow}
                            onChange={e =>
                                requestUpdateProps({ grow: e.target.checked })
                            }
                        >
                            Grow
                        </Checkbox>
                        <Checkbox
                            checked={shrink}
                            onChange={e =>
                                requestUpdateProps({ shrink: e.target.checked })
                            }
                        >
                            Shrink
                        </Checkbox>
                        <Checkbox
                            checked={wrap}
                            onChange={e =>
                                requestUpdateProps({ wrap: e.target.checked })
                            }
                        >
                            Wrap
                        </Checkbox>
                    </Flex>
                </Popover>
            </PropSource>
        </Flex>
    )
}
