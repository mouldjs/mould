import React from 'react'
import { Text, Slider } from '@modulz/radix'
import { InputGroup, NumericInput } from '@blueprintjs/core'
import { Inspector } from '../../app/types'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../../inspector/FormComponents'
import { ColorType, ColorControl } from '../../inspector/Color'

export type InputPropTypes = {
    value: string
    color: ColorType
    size: number
}

export const InputInspector: Inspector<InputPropTypes> = ({
    title,
    data,
    onChange,
}) => {
    const hasAlpha = data?.color ? typeof data.color === 'object' : false
    const alpha = hasAlpha
        ? typeof (data!.color as any).a === 'undefined'
            ? 1
            : (data!.color as any).a
        : 1

    return (
        <TitledBoard title={title || 'Input'}>
            {data && (
                <>
                    <ControlGrid>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Value</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <InputGroup
                                value={data.value}
                                onChange={(e) =>
                                    onChange({
                                        ...data,
                                        value: e.target.value,
                                    })
                                }
                            ></InputGroup>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Color</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value">
                            <ColorControl
                                color={data.color}
                                onChange={(color) => {
                                    onChange({ ...data, color })
                                }}
                            ></ColorControl>
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
                                            a:
                                                parseInt(event.target.value) /
                                                100,
                                        },
                                    })
                                }}
                            ></Slider>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Size</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value">
                            <NumericInput
                                value={data.size}
                                onValueChange={(value) => {
                                    onChange({ ...data, size: value })
                                }}
                                fill
                                buttonPosition="none"
                                min={1}
                            ></NumericInput>
                        </ControlGridItem>
                        <ControlGridItem area="control">
                            <Slider
                                value={data.size}
                                min={1}
                                max={100}
                                onChange={(event) => {
                                    onChange({
                                        ...data,
                                        size: event.target.value
                                            ? parseInt(event.target.value)
                                            : 0,
                                    })
                                }}
                            ></Slider>
                        </ControlGridItem>
                    </ControlGrid>
                </>
            )}
        </TitledBoard>
    )
}
