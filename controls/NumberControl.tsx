import React from 'react'
import { useField } from 'react-form'
import { Text, Slider } from '@modulz/radix'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../inspector/FormComponents'
import {
    HTMLSelect,
    ControlGroup,
    NumericInput,
    FormGroup,
} from '@blueprintjs/core'

const NumberControlTypes = ['Normal'] as const

type NumberControlType = typeof NumberControlTypes[number]

type NormalNumberControlConfig = {
    default: number
    max: number
    min: number
    step: number
}

type NumberControlConfig = NormalNumberControlConfig

const validateNormal = (instance) => {
    const { default: d, min, max, step } = instance.form.values
    if (min > max) {
        return `min can't be greater than max.`
    }
    if (d < min) {
        return `default can't be less than min.`
    }
    if (d > max) {
        return `default can't be greater than max.`
    }
    if (step > max - min) {
        return `step can't be greater than max - min.`
    }

    return false
}

export const Editor = () => {
    const defaultValue = useField('default', {
        defaultValue: 0,
        validate: (value, instance) => {
            return validateNormal(instance)
        },
    })
    const max = useField('max', {
        defaultValue: 100,
        validate: (value, instance) => {
            return validateNormal(instance)
        },
    })
    const min = useField('min', {
        defaultValue: 0,
        validate: (value, instance) => {
            return validateNormal(instance)
        },
    })
    const step = useField('step', {
        defaultValue: 1,
        validate: (value, instance) => {
            return validateNormal(instance)
        },
    })
    const normalPanelError =
        defaultValue.meta.error ||
        max.meta.error ||
        min.meta.error ||
        step.meta.error

    return (
        <TitledBoard title="Number Control">
            <ControlGrid marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    Range
                </ControlGridItem>
                <ControlGridItem area="value / value / control / control">
                    <ControlGroup fill>
                        <NumericInput
                            {...defaultValue.getInputProps()}
                            onChange={undefined}
                            onValueChange={(value) => {
                                defaultValue.setValue(value)
                            }}
                            fill
                            buttonPosition="none"
                        ></NumericInput>
                        <NumericInput
                            {...min.getInputProps()}
                            onChange={undefined}
                            onValueChange={(value) => {
                                min.setValue(value)
                            }}
                            fill
                            buttonPosition="none"
                        ></NumericInput>
                        <NumericInput
                            value={max.value}
                            onValueChange={(value) => {
                                max.setValue(value)
                            }}
                            fill
                            buttonPosition="none"
                            min={0}
                        ></NumericInput>
                        <NumericInput
                            value={step.value}
                            onValueChange={(value) => {
                                step.setValue(value)
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
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        default
                    </Text>
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        min
                    </Text>
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        max
                    </Text>
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        step
                    </Text>
                </ControlGridItem>
            </ControlGrid>
            {normalPanelError && (
                <ControlGrid marginTop={8}>
                    <ControlGridItem area="value / value / control / control">
                        <FormGroup helperText={normalPanelError}></FormGroup>
                    </ControlGridItem>
                </ControlGrid>
            )}
        </TitledBoard>
    )
}

export const Renderer = ({ config, data, onChange }) => {
    const { default: d, min, max, step } = config

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <NumericInput
                value={data || d}
                onValueChange={(value) => {
                    onChange(value)
                }}
                min={min}
                max={max}
                step={step}
                fill
                buttonPosition="none"
            ></NumericInput>
            <div style={{ marginLeft: 8 }}>
                <Slider
                    value={data || d}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(event) => {
                        const value = parseFloat(event.target.value)
                        onChange(value)
                    }}
                ></Slider>
            </div>
        </div>
    )
}
