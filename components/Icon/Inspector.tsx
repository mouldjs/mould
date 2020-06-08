import React from 'react'
import { Text, Slider } from '@modulz/radix'
import {
    InputGroup,
    HTMLSelect,
    NumericInput,
    Tag,
    ButtonGroup,
    Button,
} from '@blueprintjs/core'
import { Inspector } from '../../app/types'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../../inspector/FormComponents'
import { ColorType, ColorControl } from '../../inspector/Color'
import {
    BlockAlignLeft,
    BlockAlignCenter,
    BlockAlignRight,
    BlockAlignTop,
    BlockAlignMiddle,
    BlockAlignBottom,
} from '../../resources/Icons'
import { IconSelect } from '../../inspector/IconSelect'

type TextStyleType = 'normal' | 'italic'

export type IconPropTypes = {
    namespace: string
    name: string
    color: ColorType
}

export const IconInspector: Inspector<IconPropTypes> = ({
    title,
    data,
    onChange,
    connectedFields,
}) => {
    const hasAlpha = data?.color ? typeof data.color === 'object' : false
    const alpha = hasAlpha
        ? typeof (data!.color as any).a === 'undefined'
            ? 1
            : (data!.color as any).a
        : 1

    return (
        <TitledBoard title={title || 'Text'}>
            {data && (
                <>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Name</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <IconSelect
                                name={data.name}
                                onChange={(e) => {
                                    onChange({
                                        ...data,
                                        name: e || '',
                                    })
                                }}
                            ></IconSelect>
                        </ControlGridItem>
                        {/* <ControlGridItem area="value / value / control / control">
                            <InputGroup
                                value={data.name}
                                onChange={(e) =>
                                    onChange({
                                        ...data,
                                        name: e.target.value,
                                    })
                                }
                            ></InputGroup>
                        </ControlGridItem> */}
                    </ControlGrid>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Namespace</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <InputGroup
                                value={data.namespace}
                                onChange={(e) =>
                                    onChange({
                                        ...data,
                                        namespace: e.target.value,
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
                </>
            )}
        </TitledBoard>
    )
}
