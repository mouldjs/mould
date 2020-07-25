import { HTMLSelect, IOptionProps, NumericInput } from '@blueprintjs/core'
import { Text } from '@modulz/radix'
import React, { SFC, useMemo } from 'react'
import { Minus, Plus } from 'react-feather'
import {
    ControlGrid,
    ControlGridItem,
    TitledBoard,
} from '../../inspector/FormComponents'
import {
    ChildrenInspectorRenderer,
    RelativeProps,
} from '../../inspector/InspectorProvider'
import {
    LayoutSize,
    LayoutSizeUnit,
    unitMapDefaultAmount,
} from '../../inspector/Layout'

export const initialRelativeData: RelativeProps = {
    left: { amount: 0, unit: 'auto' },
    top: { amount: 0, unit: 'auto' },
    right: { amount: 0, unit: 'auto' },
    bottom: { amount: 0, unit: 'auto' },
}

const layoutSizeUnitOptions: IOptionProps[] = [
    {
        value: 'px',
        label: 'px',
    },
    {
        value: '%',
        label: '%',
    },
    {
        value: 'auto',
        label: 'unset',
    },
]

const LayoutSizeEditor: SFC<{
    value: LayoutSize
    onChange: (newValue: LayoutSize) => void
    title: string
}> = ({ value, title, onChange }) => {
    return (
        <>
            <ControlGridItem area="active / active / visual / visual">
                <Text size={1}>{title}</Text>
            </ControlGridItem>
            {value.unit !== 'auto' ? (
                <ControlGridItem area="value">
                    <NumericInput
                        value={value.amount}
                        onValueChange={(data) => {
                            onChange({ ...value, amount: data })
                        }}
                        fill
                        buttonPosition="none"
                        min={0}
                    ></NumericInput>
                </ControlGridItem>
            ) : null}
            <ControlGridItem
                area={
                    value.unit !== 'auto'
                        ? 'control'
                        : 'value / value / control / control'
                }
            >
                <HTMLSelect
                    value={value.unit}
                    onChange={(event) => {
                        const unit = event.target.value as LayoutSizeUnit

                        onChange({
                            amount: unitMapDefaultAmount[unit],
                            unit,
                        })
                    }}
                    options={layoutSizeUnitOptions}
                    fill
                    iconProps={{
                        iconSize: 0,
                        icon: null,
                    }}
                ></HTMLSelect>
            </ControlGridItem>
        </>
    )
}

export const FrameChildrenInspectorRenderer: ChildrenInspectorRenderer = (
    data,
    onChange
) => {
    const relative = data?.relative
    return useMemo(
        () => (
            <TitledBoard
                title="Position"
                collspaed={!data || !data.relative}
                renderTitle={() => {
                    return !data || !data.relative ? (
                        <Plus
                            onClick={() => {
                                onChange(
                                    data
                                        ? {
                                              ...data,
                                              relative: {
                                                  ...initialRelativeData,
                                              },
                                          }
                                        : {
                                              relative: {
                                                  ...initialRelativeData,
                                              },
                                          }
                                )
                            }}
                            size={16}
                            color="#959595"
                        ></Plus>
                    ) : (
                        <Minus
                            onClick={() => {
                                onChange({ ...data, relative: undefined })
                            }}
                            size={16}
                            color="#959595"
                        ></Minus>
                    )
                }}
            >
                {relative && (
                    <>
                        <ControlGrid>
                            <LayoutSizeEditor
                                title="Left"
                                value={relative.left}
                                onChange={(value) => {
                                    onChange({
                                        ...data,
                                        relative: { ...relative, left: value },
                                    })
                                }}
                            ></LayoutSizeEditor>
                        </ControlGrid>
                        <ControlGrid marginTop={8}>
                            <LayoutSizeEditor
                                title="Top"
                                value={relative.top}
                                onChange={(value) => {
                                    onChange({
                                        ...data,
                                        relative: { ...relative, top: value },
                                    })
                                }}
                            ></LayoutSizeEditor>
                        </ControlGrid>
                        <ControlGrid marginTop={8}>
                            <LayoutSizeEditor
                                title="Right"
                                value={relative.right}
                                onChange={(value) => {
                                    onChange({
                                        ...data,
                                        relative: { ...relative, right: value },
                                    })
                                }}
                            ></LayoutSizeEditor>
                        </ControlGrid>
                        <ControlGrid marginTop={8}>
                            <LayoutSizeEditor
                                title="Bottom"
                                value={relative.bottom}
                                onChange={(value) => {
                                    onChange({
                                        ...data,
                                        relative: {
                                            ...relative,
                                            bottom: value,
                                        },
                                    })
                                }}
                            ></LayoutSizeEditor>
                        </ControlGrid>
                    </>
                )}
            </TitledBoard>
        ),
        [relative]
    )
}
