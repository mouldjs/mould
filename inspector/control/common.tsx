import React, { SFC, Component, FunctionComponent, CSSProperties } from 'react'
import { Text } from '@modulz/radix'
import { InputGroup, NumericInput, HTMLSelect } from '@blueprintjs/core'
import { Checkbox } from '../Checkbox'
import { TitledBoard, ControlGrid, ControlGridItem } from '../FormComponents'
import * as z from 'zod'
var x: z.infer<z.ZodString>
export type TypedControl<T extends z.ZodTypeAny> = FunctionComponent<
    {
        metadata: T
        data: z.infer<T>
        title: string
        onChange: (newValue: z.infer<T>) => void
    } & CSSProperties
>

export const ControlBoolean: TypedControl<z.ZodBoolean> = ({
    data,
    title,
    onChange,
    ...restStyle
}) => {
    return (
        <ControlGrid {...restStyle}>
            <ControlGridItem area="active / active / value / value">
                <Text size={1}>{title}</Text>
            </ControlGridItem>
            <ControlGridItem area="control">
                <Checkbox
                    checked={data || false}
                    onChange={(event) => {
                        onChange(event.target.checked)
                    }}
                ></Checkbox>
            </ControlGridItem>
        </ControlGrid>
    )
}

export const ControlString: TypedControl<z.ZodString> = ({
    data,
    title,
    onChange,
    ...restStyle
}) => {
    return (
        <ControlGrid {...restStyle}>
            <ControlGridItem area="active / active / visual / visual">
                <Text size={1}>{title}</Text>
            </ControlGridItem>
            <ControlGridItem area="value / value / control / control">
                <InputGroup
                    value={data || ''}
                    onChange={(e) => onChange(e.target.value)}
                ></InputGroup>
            </ControlGridItem>
        </ControlGrid>
    )
}

export const ControlEnum: TypedControl<z.ZodEnum<[string, ...string[]]>> = ({
    data,
    title,
    metadata,
    onChange,
    ...restStyle
}) => {
    return (
        <ControlGrid {...restStyle}>
            <ControlGridItem area="active / active / visual / visual">
                <Text size={1}>{title}</Text>
            </ControlGridItem>
            <ControlGridItem area="value / value / control / control">
                <HTMLSelect
                    value={data}
                    onChange={(event) => {
                        onChange(event.target.value)
                    }}
                    options={metadata._def.values}
                    fill
                    iconProps={{
                        iconSize: 0,
                        icon: null,
                    }}
                ></HTMLSelect>
            </ControlGridItem>
        </ControlGrid>
    )
}

export const ControlNumber: TypedControl<z.ZodNumber> = ({
    data,
    title,
    metadata,
    onChange,
    ...restStyle
}) => {
    return (
        <ControlGrid {...restStyle}>
            <ControlGridItem area="active / active / visual / visual">
                <Text size={1}>{title}</Text>
            </ControlGridItem>
            <ControlGridItem area="value / value / control / control">
                <NumericInput
                    value={data}
                    onValueChange={(value) => onChange(value)}
                ></NumericInput>
            </ControlGridItem>
        </ControlGrid>
    )
}

export function getControlByType(
    type: z.ZodTypeAny
): TypedControl<z.ZodTypeAny> | null {
    if (type instanceof z.ZodNumber) {
        return ControlNumber
    }
    if (type instanceof z.ZodString) {
        return ControlString
    }
    if (type instanceof z.ZodBoolean) {
        return ControlBoolean
    }
    if (type instanceof z.ZodEnum) {
        return ControlEnum
    }
    return null
}
