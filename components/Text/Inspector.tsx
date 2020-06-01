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

type TextStyleType = 'normal' | 'italic'

export type TextPropTypes = {
    content: string
    color: ColorType
    weight: number
    style: TextStyleType
    size: number
    letterSpacing: number
    lineHeight: number
    horizontalAlign: 'left' | 'center' | 'right'
    verticalAlign: 'top' | 'middle' | 'bottom'
}

export const TextInspector: Inspector<TextPropTypes> = ({
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
                    <ControlGrid>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Content</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <InputGroup
                                value={data.content}
                                onChange={(e) =>
                                    onChange({
                                        ...data,
                                        content: e.target.value,
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
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Style</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value">
                            <HTMLSelect
                                value={data.style}
                                onChange={(event) => {
                                    onChange({
                                        ...data,
                                        style: event.target
                                            .value as TextStyleType,
                                    })
                                }}
                                options={
                                    ['normal', 'italic'] as TextStyleType[]
                                }
                                fill
                                iconProps={{
                                    iconSize: 0,
                                    icon: null,
                                }}
                            ></HTMLSelect>
                        </ControlGridItem>
                        <ControlGridItem area="control">
                            <HTMLSelect
                                value={data.weight}
                                onChange={(event) => {
                                    onChange({
                                        ...data,
                                        weight: parseInt(event.target.value),
                                    })
                                }}
                                options={[
                                    100,
                                    200,
                                    300,
                                    400,
                                    500,
                                    600,
                                    700,
                                    800,
                                    900,
                                ]}
                                fill
                                iconProps={{
                                    iconSize: 0,
                                    icon: null,
                                }}
                            ></HTMLSelect>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Spacing</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value">
                            <NumericInput
                                value={data.letterSpacing}
                                onValueChange={(value) => {
                                    onChange({ ...data, letterSpacing: value })
                                }}
                                fill
                                buttonPosition="none"
                                min={0}
                                rightElement={<Tag minimal>letter</Tag>}
                            ></NumericInput>
                        </ControlGridItem>
                        <ControlGridItem area="control">
                            <NumericInput
                                value={data.lineHeight}
                                onValueChange={(value) => {
                                    onChange({ ...data, lineHeight: value })
                                }}
                                fill
                                buttonPosition="none"
                                min={0}
                                stepSize={0.1}
                                rightElement={<Tag minimal>line</Tag>}
                            ></NumericInput>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Horizontal</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <ButtonGroup fill>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            horizontalAlign: 'left',
                                        })
                                    }
                                    active={data.horizontalAlign === 'left'}
                                >
                                    <BlockAlignLeft color="#959595"></BlockAlignLeft>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            horizontalAlign: 'center',
                                        })
                                    }
                                    active={data.horizontalAlign === 'center'}
                                >
                                    <BlockAlignCenter color="#959595"></BlockAlignCenter>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            horizontalAlign: 'right',
                                        })
                                    }
                                    active={data.horizontalAlign === 'right'}
                                >
                                    <BlockAlignRight color="#959595"></BlockAlignRight>
                                </Button>
                            </ButtonGroup>
                        </ControlGridItem>
                    </ControlGrid>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            <Text size={1}>Vertical</Text>
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <ButtonGroup fill>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            verticalAlign: 'top',
                                        })
                                    }
                                    active={data.verticalAlign === 'top'}
                                >
                                    <BlockAlignTop color="#959595"></BlockAlignTop>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            verticalAlign: 'middle',
                                        })
                                    }
                                    active={data.verticalAlign === 'middle'}
                                >
                                    <BlockAlignMiddle color="#959595"></BlockAlignMiddle>
                                </Button>
                                <Button
                                    onClick={() =>
                                        onChange({
                                            ...data,
                                            verticalAlign: 'bottom',
                                        })
                                    }
                                    active={data.verticalAlign === 'bottom'}
                                >
                                    <BlockAlignBottom color="#959595"></BlockAlignBottom>
                                </Button>
                            </ButtonGroup>
                        </ControlGridItem>
                    </ControlGrid>
                </>
            )}
        </TitledBoard>
    )
}
