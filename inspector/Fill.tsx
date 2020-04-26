import React from 'react'
import { omit } from 'ramda'
import { TitledBoard, ControlGrid, ControlGridItem } from './FormComponents'
import { Plus, Minus } from 'react-feather'
import { NumericInput, Tag } from '@blueprintjs/core'
import {
    Slider,
    Text,
    DropdownMenu,
    Menu,
    MenuItem,
    Button,
} from '@modulz/radix'
import { Checkbox } from './Checkbox'
import { Inspector } from '../app/types'
import { ColorControl, ColorType } from './Color'

export type FillPropTypes = {
    color: ColorType
    active: boolean
}

const initialData: FillPropTypes = {
    color: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },
    active: true,
}

export const FillInspector: Inspector<FillPropTypes> = ({
    data,
    onChange,
    title,
    connectedFields,
}) => {
    if (connectedFields && !connectedFields.includes('background')) {
        return null
    }
    const hasAlpha = data ? typeof data.color === 'object' : false
    const alpha = hasAlpha
        ? typeof (data!.color as any).a === 'undefined'
            ? 1
            : (data!.color as any).a
        : 1

    return (
        <TitledBoard
            collspaed={!data}
            title={title || 'Fill'}
            renderTitle={() => {
                return !data ? (
                    <Plus
                        onClick={() => {
                            onChange(initialData)
                        }}
                        size={16}
                        color="#959595"
                    ></Plus>
                ) : (
                    <Minus
                        onClick={() => {
                            onChange(undefined)
                        }}
                        size={16}
                        color="#959595"
                    ></Minus>
                )
            }}
        >
            {data && (
                <ControlGrid>
                    <ControlGridItem area="active">
                        <Checkbox
                            checked={data.active}
                            onChange={(event) => {
                                onChange({
                                    ...data,
                                    active: event.target.checked,
                                })
                            }}
                        ></Checkbox>
                    </ControlGridItem>
                    <ControlGridItem area="visual">
                        <ColorControl
                            color={data.color}
                            onChange={(color) => onChange({ ...data, color })}
                        ></ColorControl>
                    </ControlGridItem>
                    <ControlGridItem area="value">
                        <NumericInput
                            value={alpha * 100}
                            disabled={!hasAlpha}
                            onValueChange={(value) => {
                                onChange({
                                    ...data,
                                    color: {
                                        ...(data.color as any),
                                        a: value / 100,
                                    },
                                })
                            }}
                            fill
                            buttonPosition="none"
                            min={0}
                            max={100}
                            rightElement={<Tag minimal>%</Tag>}
                        ></NumericInput>
                    </ControlGridItem>
                    <ControlGridItem area="control">
                        <Slider
                            disabled={!hasAlpha}
                            value={alpha * 100}
                            min={0}
                            max={100}
                            onChange={(event) => {
                                onChange({
                                    ...data,
                                    color: {
                                        ...(data.color as any),
                                        a: parseInt(event.target.value) / 100,
                                    },
                                })
                            }}
                        ></Slider>
                    </ControlGridItem>
                </ControlGrid>
            )}
        </TitledBoard>
    )
}
