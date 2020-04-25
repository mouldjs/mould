import React from 'react'
import { TitledBoard, ControlGrid } from './FormComponents'
import { Plus, Minus } from 'react-feather'
import { HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Slider, Text } from '@modulz/radix'
import { Checkbox } from './Checkbox'
import { Inspector } from '../app/types'

type BlurStyle = 'Layer' | 'Background'

export type BlurPropTypes = {
    active: boolean
    blurStyle: BlurStyle
    blurAmount: number
    unit: 'px'
}

const initialData: BlurPropTypes = {
    active: true,
    blurStyle: 'Layer',
    blurAmount: 12,
    unit: 'px',
}

export const BlurInspector: Inspector<BlurPropTypes> = ({
    data,
    onChange,
    title,
    connectedFields,
}) => {
    if (connectedFields && !connectedFields.includes('filter')) {
        return null
    }

    return (
        <TitledBoard
            collspaed={!data}
            title={title || 'Blur'}
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
                        value={data.blurStyle}
                        onChange={(event) => {
                            const value = event.target.value
                            if (value === 'Remove') {
                                onChange(undefined)
                            } else {
                                onChange({
                                    ...data,
                                    blurStyle: value as BlurStyle,
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
                        iconProps={{ iconSize: 0, icon: null }}
                    >
                        <option value="Layer">Layer</option>
                        <option value="Background">Background</option>
                        <option disabled>────</option>
                        <option value="Remove">Remove</option>
                    </HTMLSelect>
                ) : (
                    <Minus
                        onClick={() => onChange(undefined)}
                        color="#959595"
                        size={16}
                    ></Minus>
                )
            }}
        >
            {data ? (
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
                        <Text as="p" size={0}>
                            Amount
                        </Text>
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
                            value={data.blurAmount}
                            onValueChange={(value) => {
                                onChange({ ...data, blurAmount: value })
                            }}
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
                        <Slider
                            value={data.blurAmount}
                            min={0}
                            max={50}
                            onChange={(event) =>
                                onChange({
                                    ...data,
                                    blurAmount: parseInt(event.target.value),
                                })
                            }
                        ></Slider>
                    </div>
                </ControlGrid>
            ) : null}
        </TitledBoard>
    )
}
