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

export type FilterType =
    | 'Brightness'
    | 'Contrast'
    | 'Grayscale'
    | 'Hue Rotate'
    | 'Invert'
    | 'Saturate'
    | 'Sepia'

const FiltersConfig: {
    [filter in FilterType]: {
        unit: string
        symbol: string
        min: number
        max: number
        default: number
    }
} = {
    Brightness: {
        unit: '%',
        symbol: '%',
        min: 0,
        max: 200,
        default: 100,
    },
    Contrast: {
        unit: '%',
        symbol: '%',
        min: 0,
        max: 200,
        default: 100,
    },
    Grayscale: {
        unit: '%',
        symbol: '%',
        min: 0,
        max: 100,
        default: 0,
    },
    'Hue Rotate': {
        unit: 'deg',
        symbol: '°',
        min: 0,
        max: 360,
        default: 0,
    },
    Invert: {
        unit: '%',
        symbol: '%',
        min: 0,
        max: 100,
        default: 0,
    },
    Saturate: {
        unit: '%',
        symbol: '%',
        min: 0,
        max: 200,
        default: 100,
    },
    Sepia: {
        unit: '%',
        symbol: '%',
        min: 0,
        max: 100,
        default: 0,
    },
}

type FilterData = {
    active: boolean
    amount: number
    unit: string
}

export type FilterPropTypes = {
    [key in FilterType]?: FilterData
}

export const FiltersInspector = ({
    data,
    onChange,
}: {
    data: FilterPropTypes | undefined
    onChange: (data?: FilterPropTypes) => void
}) => {
    return (
        <TitledBoard
            collspaed={!data}
            title="Filters"
            renderTitle={() => {
                const restFilters = Object.keys(
                    omit(Object.keys(data || {}), FiltersConfig)
                )
                const inactiveFilters = (Object.keys(
                    data || {}
                ) as FilterType[]).filter(
                    (filterType) => !(data || {})[filterType]?.active
                )

                return (
                    <>
                        {!!inactiveFilters.length && (
                            <Minus
                                onClick={() => {
                                    const nextData = omit(inactiveFilters, data)
                                    if (Object.keys(nextData).length === 0) {
                                        onChange()
                                    } else {
                                        onChange(nextData)
                                    }
                                }}
                                color="#959595"
                                size={16}
                            ></Minus>
                        )}
                        <DropdownMenu
                            button={
                                <Button
                                    variant="ghost"
                                    style={{
                                        padding: 0,
                                        paddingLeft: 8,
                                    }}
                                >
                                    <Plus color="#959595" size={16}></Plus>
                                </Button>
                            }
                            menu={
                                <Menu>
                                    {restFilters.map((filterType) => {
                                        return (
                                            <MenuItem
                                                onSelect={() => {
                                                    onChange({
                                                        ...(data || {}),
                                                        [filterType]: {
                                                            active: true,
                                                            amount:
                                                                FiltersConfig[
                                                                    filterType
                                                                ].default,
                                                            unit:
                                                                FiltersConfig[
                                                                    filterType
                                                                ].unit,
                                                        },
                                                    })
                                                }}
                                                label={filterType}
                                            ></MenuItem>
                                        )
                                    })}
                                </Menu>
                            }
                        ></DropdownMenu>
                    </>
                )
            }}
        >
            {data && (
                <>
                    {Object.keys(data).map((filterType: FilterType) => {
                        const filterData = data[filterType] as FilterData

                        return (
                            <ControlGrid>
                                <ControlGridItem area="active">
                                    <Checkbox
                                        checked={filterData.active}
                                        onChange={(event) => {
                                            onChange({
                                                ...data,
                                                [filterType]: {
                                                    ...filterData,
                                                    active:
                                                        event.target.checked,
                                                },
                                            })
                                        }}
                                    ></Checkbox>
                                </ControlGridItem>
                                <ControlGridItem area="visual">
                                    <Text
                                        as="p"
                                        size={0}
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {filterType}
                                    </Text>
                                </ControlGridItem>
                                <ControlGridItem area="value">
                                    <NumericInput
                                        value={filterData.amount}
                                        onValueChange={(value) => {
                                            onChange({
                                                ...data,
                                                [filterType]: {
                                                    ...filterData,
                                                    amount: value,
                                                },
                                            })
                                        }}
                                        fill
                                        buttonPosition="none"
                                        min={FiltersConfig[filterType].min}
                                        max={FiltersConfig[filterType].max}
                                        rightElement={
                                            <Tag minimal>
                                                {
                                                    FiltersConfig[filterType]
                                                        .symbol
                                                }
                                            </Tag>
                                        }
                                    ></NumericInput>
                                </ControlGridItem>
                                <ControlGridItem area="control">
                                    <Slider
                                        value={filterData.amount}
                                        min={FiltersConfig[filterType].min}
                                        max={FiltersConfig[filterType].max}
                                        onChange={(event) => {
                                            onChange({
                                                ...data,
                                                [filterType]: {
                                                    ...filterData,
                                                    amount: parseInt(
                                                        event.target.value
                                                    ),
                                                },
                                            })
                                        }}
                                    ></Slider>
                                </ControlGridItem>
                            </ControlGrid>
                        )
                    })}
                </>
            )}
        </TitledBoard>
    )
}
