import React from 'react'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../../inspector/FormComponents'
import {
    Plus,
    Minus,
    ArrowRight,
    ArrowDown,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Square,
    Maximize,
    ArrowUp,
    ArrowLeft,
} from 'react-feather'
import {
    NumericInput,
    ControlGroup,
    ButtonGroup,
    Button,
    HTMLSelect,
} from '@blueprintjs/core'
import { Text, Slider } from '@modulz/radix'
import { Inspector } from '../../app/types'
import { intersection } from 'ramda'
import { ChildrenInspectorRenderer } from '../ContainerRelatedInspector/InspectorProvider'

export type StackDirection =
    | 'Horizontal'
    | 'Vertical'
    | 'HorizontalReverse'
    | 'VerticalReverse'

export type StackDistribution =
    | 'Start'
    | 'Center'
    | 'End'
    | 'Space Between'
    | 'Space Around'
    | 'Space Evenly'

export type StackAlignment = 'Start' | 'Center' | 'End'

type Padding =
    | number
    | {
          t: number
          r: number
          b: number
          l: number
      }

export type StackPropTypes = {
    direction: StackDirection
    distribute: StackDistribution
    alignment: StackAlignment
    gap: number
    padding: Padding
    active: boolean
}

export const initialData: StackPropTypes = {
    direction: 'Horizontal',
    distribute: 'Start',
    alignment: 'Start',
    gap: 0,
    padding: 0,
    active: true,
}

const mutedFields = [
    'gap',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'padding',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
]

export const StackChildrenInspectorRenderer: ChildrenInspectorRenderer = (
    data,
    onChange
) => {
    const flex = data.flex || { grow: 0, shrink: 0 }
    return (
        <TitledBoard title="Stack Flex">
            <ControlGrid>
                <ControlGridItem area="active / active / value / value">
                    <Text size={1}>Expand ratio</Text>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <NumericInput
                        value={flex.grow}
                        onValueChange={(value) => {
                            onChange({
                                ...data,
                                flex: { ...flex, grow: value },
                            })
                        }}
                        fill
                        buttonPosition="none"
                        min={0}
                    ></NumericInput>
                </ControlGridItem>
            </ControlGrid>
            <ControlGrid marginTop={8}>
                <ControlGridItem area="active / active / value / value">
                    <Text size={1}>Shrink ratio</Text>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <NumericInput
                        value={flex.shrink}
                        onValueChange={(value) => {
                            onChange({
                                ...data,
                                flex: { ...flex, shrink: value },
                            })
                        }}
                        fill
                        buttonPosition="none"
                        min={0}
                    ></NumericInput>
                </ControlGridItem>
            </ControlGrid>
        </TitledBoard>
    )
}

export const StackInspector: Inspector<StackPropTypes> = ({
    title,
    data,
    onChange,
    connectedFields,
}) => {
    const fields = connectedFields
        ? intersection(connectedFields, mutedFields)
        : mutedFields
    if (connectedFields && !fields.length) {
        return null
    }

    const splittedPadding = typeof data?.padding === 'object'
    const usePadding = !!intersection(fields, [
        'padding',
        'paddingLeft',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
    ]).length

    return (
        <TitledBoard
            title={title || 'Stack'}
            collspaed={!data || !data.active}
            renderTitle={() => {
                return !data || !data.active ? (
                    <Plus
                        onClick={() => {
                            onChange(
                                data ? { ...data, active: true } : initialData
                            )
                        }}
                        size={16}
                        color="#959595"
                    ></Plus>
                ) : (
                    <Minus
                        onClick={() => {
                            onChange({ ...data, active: false })
                        }}
                        size={16}
                        color="#959595"
                    ></Minus>
                )
            }}
        >
            {data && (
                <>
                    <ControlGrid show={fields.includes('flexDirection')}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Direction</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <ButtonGroup fill>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            direction: 'Horizontal',
                                        })
                                    }
                                    active={data.direction === 'Horizontal'}
                                >
                                    <ArrowRight
                                        size={16}
                                        color="#959595"
                                    ></ArrowRight>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            direction: 'Vertical',
                                        })
                                    }
                                    active={data?.direction === 'Vertical'}
                                >
                                    <ArrowDown
                                        size={16}
                                        color="#959595"
                                    ></ArrowDown>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            direction: 'HorizontalReverse',
                                        })
                                    }
                                    active={
                                        data.direction === 'HorizontalReverse'
                                    }
                                >
                                    <ArrowLeft
                                        size={16}
                                        color="#959595"
                                    ></ArrowLeft>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            direction: 'VerticalReverse',
                                        })
                                    }
                                    active={
                                        data?.direction === 'VerticalReverse'
                                    }
                                >
                                    <ArrowUp
                                        size={16}
                                        color="#959595"
                                    ></ArrowUp>
                                </Button>
                            </ButtonGroup>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid
                        show={fields.includes('justifyContent')}
                        marginTop={8}
                    >
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Distribute</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <HTMLSelect
                                value={data.distribute}
                                onChange={(event) => {
                                    onChange({
                                        ...data,
                                        distribute: event.target
                                            .value as StackDistribution,
                                    })
                                }}
                                options={
                                    [
                                        'Start',
                                        'Center',
                                        'End',
                                        'Space Between',
                                        'Space Around',
                                        'Space Evenly',
                                    ] as StackDistribution[]
                                }
                                fill
                                iconProps={{
                                    iconSize: 0,
                                    icon: null,
                                }}
                            ></HTMLSelect>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid
                        show={fields.includes('alignItems')}
                        marginTop={8}
                    >
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Align</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <ButtonGroup fill>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            alignment: 'Start',
                                        })
                                    }
                                    active={data.alignment === 'Start'}
                                >
                                    <AlignLeft
                                        size={16}
                                        color="#959595"
                                    ></AlignLeft>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            alignment: 'Center',
                                        })
                                    }
                                    active={data.alignment === 'Center'}
                                >
                                    <AlignCenter
                                        size={16}
                                        color="#959595"
                                    ></AlignCenter>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            alignment: 'End',
                                        })
                                    }
                                    active={data.alignment === 'End'}
                                >
                                    <AlignRight
                                        size={16}
                                        color="#959595"
                                    ></AlignRight>
                                </Button>
                            </ButtonGroup>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid show={fields.includes('gap')} marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Gap</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value">
                            <NumericInput
                                value={data.gap}
                                onValueChange={(value) => {
                                    onChange({ ...data, gap: value })
                                }}
                                fill
                                buttonPosition="none"
                                min={0}
                            ></NumericInput>
                        </ControlGridItem>
                        <ControlGridItem area="control">
                            <Slider
                                value={data.gap}
                                min={0}
                                max={100}
                                onChange={(event) => {
                                    onChange({
                                        ...data,
                                        gap: event.target.value
                                            ? parseInt(event.target.value)
                                            : 0,
                                    })
                                }}
                            ></Slider>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid show={usePadding} marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Padding</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value">
                            <NumericInput
                                value={
                                    splittedPadding
                                        ? 0
                                        : (data.padding as number)
                                }
                                onValueChange={(value) => {
                                    onChange({ ...data, padding: value })
                                }}
                                disabled={splittedPadding}
                                fill
                                buttonPosition="none"
                                min={0}
                            ></NumericInput>
                        </ControlGridItem>
                        <ControlGridItem area="control">
                            <ButtonGroup fill>
                                <Button
                                    active={!splittedPadding}
                                    onClick={() => {
                                        onChange({
                                            ...data,
                                            padding: 0,
                                        })
                                    }}
                                >
                                    <Square size={16} color="#959595"></Square>
                                </Button>
                                <Button
                                    active={splittedPadding}
                                    onClick={() => {
                                        const currentWidth = data.padding as number

                                        onChange({
                                            ...data,
                                            padding: {
                                                l: currentWidth,
                                                t: currentWidth,
                                                r: currentWidth,
                                                b: currentWidth,
                                            },
                                        })
                                    }}
                                >
                                    <Maximize
                                        size={16}
                                        color="#959595"
                                    ></Maximize>
                                </Button>
                            </ButtonGroup>
                        </ControlGridItem>
                    </ControlGrid>
                    {splittedPadding && usePadding && (
                        <>
                            <ControlGrid marginTop={8}>
                                <ControlGridItem area="value / value / control / control">
                                    <ControlGroup fill>
                                        <NumericInput
                                            value={(data.padding as any).t}
                                            onValueChange={(value) => {
                                                onChange({
                                                    ...data,
                                                    padding: {
                                                        ...(data.padding as any),
                                                        t: value,
                                                    },
                                                })
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                        <NumericInput
                                            value={(data.padding as any).r}
                                            onValueChange={(value) => {
                                                onChange({
                                                    ...data,
                                                    padding: {
                                                        ...(data.padding as any),
                                                        r: value,
                                                    },
                                                })
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                        <NumericInput
                                            value={(data.padding as any).b}
                                            onValueChange={(value) => {
                                                onChange({
                                                    ...data,
                                                    padding: {
                                                        ...(data.padding as any),
                                                        b: value,
                                                    },
                                                })
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                        <NumericInput
                                            value={(data.padding as any).l}
                                            onValueChange={(value) => {
                                                onChange({
                                                    ...data,
                                                    padding: {
                                                        ...(data.padding as any),
                                                        l: value,
                                                    },
                                                })
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                    </ControlGroup>
                                </ControlGridItem>
                            </ControlGrid>
                            <ControlGrid>
                                <ControlGridItem area="value / value / control / control">
                                    <Text
                                        size={0}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        T
                                    </Text>
                                    <Text
                                        size={0}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        R
                                    </Text>
                                    <Text
                                        size={0}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        B
                                    </Text>
                                    <Text
                                        size={0}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        L
                                    </Text>
                                </ControlGridItem>
                            </ControlGrid>
                        </>
                    )}
                </>
            )}
        </TitledBoard>
    )
}
