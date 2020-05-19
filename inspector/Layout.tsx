import React from 'react'
import { TitledBoard, ControlGrid, ControlGridItem } from './FormComponents'
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
} from 'react-feather'
import {
    NumericInput,
    ControlGroup,
    ButtonGroup,
    Button,
    HTMLSelect,
} from '@blueprintjs/core'
import { Text, Slider } from '@modulz/radix'
import { Inspector } from '../app/types'
import { intersection } from 'ramda'
import { nameToParam } from '../app/utils'

type LayoutSizeUnit = 'px' | '%' | 'fr'

type LayoutSize = {
    amount: number
    unit: LayoutSizeUnit
}

type LayoutOverflow = 'Visible' | 'Hidden'

type LayoutRadius =
    | number
    | {
          t: number
          r: number
          b: number
          l: number
      }

export type LayoutPropTypes = {
    width: LayoutSize
    height: LayoutSize
    lockProportion: boolean
    overflow: LayoutOverflow
    opacity: number
    rotation: number
    radius: LayoutRadius
}

export const transformLayout = (
    {
        width,
        height,
        lockProportion,
        overflow,
        opacity,
        rotation,
        radius,
    }: LayoutPropTypes = {
        width: {
            amount: 100,
            unit: '%',
        },
        height: {
            amount: 100,
            unit: '%',
        },
        lockProportion: false,
        overflow: 'Visible',
        opacity: 100,
        rotation: 0,
        radius: 0,
    }
) => {
    const radiusStr =
        typeof radius === 'object'
            ? `${radius.t}px ${radius.r}px ${radius.b}px ${radius.l}px`
            : `${radius}px`

    return {
        width: `${width.amount}${width.unit}`,
        height: `${height.amount}${height.unit}`,
        overflow: nameToParam(overflow) as 'visible' | 'hidden' | undefined,
        opacity: opacity / 100 + '',
        rotate: rotation,
        radius: radiusStr,
    }
}

const initialData: LayoutPropTypes = {
    width: {
        amount: 100,
        unit: '%',
    },
    height: {
        amount: 100,
        unit: '%',
    },
    lockProportion: false,
    overflow: 'Visible',
    opacity: 100,
    rotation: 0,
    radius: 0,
}

const unitMapDefaultAmount: {
    [unit in LayoutSizeUnit]: number
} = {
    px: 100,
    '%': 100,
    fr: 1,
}

export const LayoutInspector: Inspector<LayoutPropTypes> = ({
    title,
    data = initialData,
    onChange,
    connectedFields,
}) => {
    const mutedFields = [
        'width',
        'height',
        'overflow',
        'opacity',
        'borderRadius',
        'rotate',
    ]
    const fields = connectedFields
        ? intersection(connectedFields, mutedFields)
        : mutedFields
    if (connectedFields && !fields.length) {
        return null
    }

    const splittedRadius = typeof data.radius === 'object'

    return (
        <TitledBoard title={title || 'Layout'}>
            <ControlGrid show={fields.includes('width')}>
                <ControlGridItem area="active / active / visual / visual">
                    <Text size={1}>Width</Text>
                </ControlGridItem>
                <ControlGridItem area="value">
                    <NumericInput
                        value={data.width.amount}
                        onValueChange={(value) => {
                            onChange({
                                ...data,
                                width: { ...data.width, amount: value },
                            })
                        }}
                        fill
                        buttonPosition="none"
                        min={0}
                    ></NumericInput>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <HTMLSelect
                        value={data.width.unit}
                        onChange={(event) => {
                            const unit = event.target.value as LayoutSizeUnit

                            onChange({
                                ...data,
                                width: {
                                    amount: unitMapDefaultAmount[unit],
                                    unit,
                                },
                            })
                        }}
                        options={['px', '%', 'fr'] as LayoutSizeUnit[]}
                        fill
                        iconProps={{
                            iconSize: 0,
                            icon: null,
                        }}
                    ></HTMLSelect>
                </ControlGridItem>
            </ControlGrid>
            <ControlGrid show={fields.includes('height')} marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    <Text size={1}>Height</Text>
                </ControlGridItem>
                <ControlGridItem area="value">
                    <NumericInput
                        value={data.height.amount}
                        onValueChange={(value) => {
                            onChange({
                                ...data,
                                height: { ...data.height, amount: value },
                            })
                        }}
                        fill
                        buttonPosition="none"
                        min={0}
                    ></NumericInput>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <HTMLSelect
                        value={data.height.unit}
                        onChange={(event) => {
                            onChange({
                                ...data,
                                height: {
                                    ...data.height,
                                    unit: event.target.value as LayoutSizeUnit,
                                },
                            })
                        }}
                        options={['px', '%', 'fr'] as LayoutSizeUnit[]}
                        fill
                        iconProps={{
                            iconSize: 0,
                            icon: null,
                        }}
                    ></HTMLSelect>
                </ControlGridItem>
            </ControlGrid>
            <ControlGrid show={fields.includes('overflow')} marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    <Text size={1}>Overflow</Text>
                </ControlGridItem>
                <ControlGridItem area="value / value / control / control">
                    <ButtonGroup fill>
                        <Button
                            onClick={() =>
                                onChange({
                                    ...data,
                                    overflow: 'Visible',
                                })
                            }
                            active={data.overflow === 'Visible'}
                        >
                            Visible
                        </Button>
                        <Button
                            onClick={() =>
                                onChange({
                                    ...data,
                                    overflow: 'Hidden',
                                })
                            }
                            active={data.overflow === 'Hidden'}
                        >
                            Hidden
                        </Button>
                    </ButtonGroup>
                </ControlGridItem>
            </ControlGrid>
            <ControlGrid show={fields.includes('opacity')} marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    <Text size={1}>Opacity</Text>
                </ControlGridItem>
                <ControlGridItem area="value">
                    <NumericInput
                        value={data.opacity}
                        onValueChange={(value) => {
                            onChange({ ...data, opacity: value })
                        }}
                        fill
                        buttonPosition="none"
                        min={0}
                        max={100}
                    ></NumericInput>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <Slider
                        value={data.opacity}
                        min={0}
                        max={100}
                        onChange={(event) => {
                            onChange({
                                ...data,
                                opacity: event.target.value
                                    ? parseInt(event.target.value)
                                    : 0,
                            })
                        }}
                    ></Slider>
                </ControlGridItem>
            </ControlGrid>
            <ControlGrid show={fields.includes('rotation')} marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    <Text size={1}>Rotation</Text>
                </ControlGridItem>
                <ControlGridItem area="value">
                    <NumericInput
                        value={data.rotation}
                        onValueChange={(value) => {
                            onChange({ ...data, rotation: value })
                        }}
                        fill
                        buttonPosition="none"
                    ></NumericInput>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <Slider
                        value={data.rotation}
                        min={0}
                        max={360}
                        onChange={(event) => {
                            onChange({
                                ...data,
                                rotation: event.target.value
                                    ? parseInt(event.target.value)
                                    : 0,
                            })
                        }}
                    ></Slider>
                </ControlGridItem>
            </ControlGrid>
            <ControlGrid show={fields.includes('borderRadius')} marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    <Text size={1}>Radius</Text>
                </ControlGridItem>
                <ControlGridItem area="value">
                    <NumericInput
                        value={splittedRadius ? 0 : (data.radius as number)}
                        onValueChange={(value) => {
                            onChange({ ...data, radius: value })
                        }}
                        disabled={splittedRadius}
                        fill
                        buttonPosition="none"
                        min={0}
                    ></NumericInput>
                </ControlGridItem>
                <ControlGridItem area="control">
                    <ButtonGroup fill>
                        <Button
                            active={!splittedRadius}
                            onClick={() => {
                                onChange({
                                    ...data,
                                    radius: 0,
                                })
                            }}
                        >
                            <Square size={16} color="#959595"></Square>
                        </Button>
                        <Button
                            active={splittedRadius}
                            onClick={() => {
                                const currentWidth = data.radius as number

                                onChange({
                                    ...data,
                                    radius: {
                                        l: currentWidth,
                                        t: currentWidth,
                                        r: currentWidth,
                                        b: currentWidth,
                                    },
                                })
                            }}
                        >
                            <Maximize size={16} color="#959595"></Maximize>
                        </Button>
                    </ButtonGroup>
                </ControlGridItem>
            </ControlGrid>
            {splittedRadius && fields.includes('borderRadius') && (
                <>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="value / value / control / control">
                            <ControlGroup fill>
                                <NumericInput
                                    value={(data.radius as any).t}
                                    onValueChange={(value) => {
                                        onChange({
                                            ...data,
                                            radius: {
                                                ...(data.radius as any),
                                                t: value,
                                            },
                                        })
                                    }}
                                    fill
                                    buttonPosition="none"
                                ></NumericInput>
                                <NumericInput
                                    value={(data.radius as any).r}
                                    onValueChange={(value) => {
                                        onChange({
                                            ...data,
                                            radius: {
                                                ...(data.radius as any),
                                                r: value,
                                            },
                                        })
                                    }}
                                    fill
                                    buttonPosition="none"
                                ></NumericInput>
                                <NumericInput
                                    value={(data.radius as any).b}
                                    onValueChange={(value) => {
                                        onChange({
                                            ...data,
                                            radius: {
                                                ...(data.radius as any),
                                                b: value,
                                            },
                                        })
                                    }}
                                    fill
                                    buttonPosition="none"
                                ></NumericInput>
                                <NumericInput
                                    value={(data.radius as any).l}
                                    onValueChange={(value) => {
                                        onChange({
                                            ...data,
                                            radius: {
                                                ...(data.radius as any),
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
        </TitledBoard>
    )
}
