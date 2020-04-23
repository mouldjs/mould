import React from 'react'
import * as z from 'zod'
import {
    NumericInput,
    ButtonGroup,
    Button,
    HTMLSelect,
    ControlGroup,
} from '@blueprintjs/core'
import { Text } from '@modulz/radix'
import { Plus, Minus } from 'react-feather'
import { TitledBoard, ControlGrid, ControlGridItem } from './FormComponents'
import { ColorControl, Color, transformColorToStr } from './Color'
import { BorderAll, BorderOutside } from '../resources/Icons'
import { Checkbox } from './Checkbox'

const BorderSplittedWidth = z.object({
    l: z.number(),
    t: z.number(),
    r: z.number(),
    b: z.number(),
})

type BorderSplittedWidthType = z.infer<typeof BorderSplittedWidth>

const BorderWidth = z.union([z.number(), BorderSplittedWidth])

const BorderStyle = z.union([
    z.literal('Solid'),
    z.literal('Dashed'),
    z.literal('Dotted'),
    z.literal('Double'),
])

export const BorderProps = z.object({
    borderColor: Color,
    borderStyle: BorderStyle,
    borderWidth: BorderWidth,
    active: z.boolean(),
})

export type BorderPropTypes = z.infer<typeof BorderProps>

const initialData: BorderPropTypes = {
    active: true,
    borderColor: '#000',
    borderStyle: 'Solid',
    borderWidth: 1,
}

export const transformBorderProps = (data: BorderPropTypes | undefined) => {
    if (!data || !data.active) {
        return { border: '' }
    }

    if (typeof data.borderWidth === 'object') {
        const w = (data.borderWidth as any) as BorderSplittedWidthType
        return {
            borderWidth: `${w.t}px ${w.r}px ${w.b}px ${w.l}px`,
            borderStyle: data.borderStyle,
            borderColor: transformColorToStr(data.borderColor),
        }
    }

    return {
        border: `${data.borderWidth}px ${
            data.borderStyle
        } ${transformColorToStr(data.borderColor)}`,
    }
}

export const BorderInspector = ({
    data,
    onChange,
}: {
    data: BorderPropTypes | undefined
    onChange: (data?: BorderPropTypes) => void
}) => {
    const splittedWidth = typeof data?.borderWidth === 'object'
    const borderWidth = splittedWidth
        ? (data?.borderWidth as BorderSplittedWidthType)
        : (data?.borderWidth as number)

    return (
        <TitledBoard
            collspaed={!data}
            title="Border"
            renderTitle={() => {
                return !data ? (
                    <Plus
                        onClick={() => {
                            onChange(initialData)
                        }}
                        color="#959595"
                        size={16}
                    ></Plus>
                ) : data.active ? (
                    <HTMLSelect
                        value={data.borderStyle}
                        onChange={(event) => {
                            const value = event.target.value
                            if (value === 'Remove') {
                                onChange()
                            } else {
                                onChange({
                                    ...data,
                                    borderStyle: value as z.infer<
                                        typeof BorderStyle
                                    >,
                                })
                            }
                        }}
                        minimal
                        style={{
                            paddingRight: 0,
                            width: 45,
                            paddingTop: 0,
                            paddingBottom: 0,
                            height: 16,
                        }}
                        iconProps={{
                            iconSize: 0,
                            icon: null,
                        }}
                    >
                        <option value="Solid">Solid</option>
                        <option value="Dashed">Dashed</option>
                        <option value="Dotted">Dotted</option>
                        <option value="Double">Double</option>
                        <option disabled>────</option>
                        <option value="Remove">Remove</option>
                    </HTMLSelect>
                ) : (
                    <Minus
                        onClick={() => {
                            onChange()
                        }}
                        color="#959595"
                        size={16}
                    ></Minus>
                )
            }}
        >
            {data ? (
                <>
                    <ControlGrid>
                        <div
                            style={{
                                gridArea: 'active',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                checked={data.active}
                                onChange={(event) =>
                                    onChange({
                                        ...data,
                                        active: (event.target as any).checked,
                                    })
                                }
                            ></Checkbox>
                        </div>
                        <div
                            style={{
                                gridArea: 'visual',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <ColorControl
                                color={data.borderColor}
                                onChange={(color) =>
                                    onChange({ ...data, borderColor: color })
                                }
                            ></ColorControl>
                        </div>
                        <div
                            style={{
                                gridArea: 'value',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <NumericInput
                                value={
                                    splittedWidth
                                        ? ''
                                        : (data.borderWidth as number)
                                }
                                onValueChange={(value) => {
                                    onChange({
                                        ...data,
                                        borderWidth: value,
                                    })
                                }}
                                disabled={splittedWidth}
                                fill
                                buttonPosition="none"
                                min={0}
                            ></NumericInput>
                        </div>
                        <div
                            style={{
                                gridArea: 'control',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <ButtonGroup fill>
                                <Button
                                    active={!splittedWidth}
                                    onClick={() => {
                                        onChange({
                                            ...data,
                                            borderWidth: 1,
                                        })
                                    }}
                                >
                                    <BorderAll></BorderAll>
                                </Button>
                                <Button
                                    active={splittedWidth}
                                    onClick={() => {
                                        const currentWidth = data.borderWidth as number

                                        onChange({
                                            ...data,
                                            borderWidth: {
                                                l: currentWidth,
                                                t: currentWidth,
                                                r: currentWidth,
                                                b: currentWidth,
                                            },
                                        })
                                    }}
                                >
                                    <BorderOutside></BorderOutside>
                                </Button>
                            </ButtonGroup>
                        </div>
                    </ControlGrid>
                    {splittedWidth && (
                        <>
                            <ControlGrid marginTop={8}>
                                <div
                                    style={{
                                        gridArea:
                                            'value / value / control / control',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ControlGroup fill>
                                        <NumericInput
                                            value={
                                                (borderWidth as BorderSplittedWidthType)
                                                    .t
                                            }
                                            onValueChange={(value) =>
                                                onChange({
                                                    ...data,
                                                    borderWidth: {
                                                        ...(borderWidth as BorderSplittedWidthType),
                                                        t: value,
                                                    },
                                                })
                                            }
                                            fill
                                            buttonPosition="none"
                                            min={0}
                                        ></NumericInput>
                                        <NumericInput
                                            value={
                                                (borderWidth as BorderSplittedWidthType)
                                                    .r
                                            }
                                            onValueChange={(value) =>
                                                onChange({
                                                    ...data,
                                                    borderWidth: {
                                                        ...(borderWidth as BorderSplittedWidthType),
                                                        r: value,
                                                    },
                                                })
                                            }
                                            fill
                                            buttonPosition="none"
                                            min={0}
                                        ></NumericInput>
                                        <NumericInput
                                            value={
                                                (borderWidth as BorderSplittedWidthType)
                                                    .b
                                            }
                                            onValueChange={(value) =>
                                                onChange({
                                                    ...data,
                                                    borderWidth: {
                                                        ...(borderWidth as BorderSplittedWidthType),
                                                        b: value,
                                                    },
                                                })
                                            }
                                            fill
                                            buttonPosition="none"
                                            min={0}
                                        ></NumericInput>
                                        <NumericInput
                                            value={
                                                (borderWidth as BorderSplittedWidthType)
                                                    .l
                                            }
                                            onValueChange={(value) =>
                                                onChange({
                                                    ...data,
                                                    borderWidth: {
                                                        ...(borderWidth as BorderSplittedWidthType),
                                                        l: value,
                                                    },
                                                })
                                            }
                                            fill
                                            buttonPosition="none"
                                            min={0}
                                        ></NumericInput>
                                    </ControlGroup>
                                </div>
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
            ) : null}
        </TitledBoard>
    )
}
