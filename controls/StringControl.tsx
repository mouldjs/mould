import React from 'react'
import { useField } from 'react-form'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../inspector/FormComponents'
import {
    ButtonGroup,
    Button,
    InputGroup,
    TextArea,
    FormGroup,
    HTMLSelect,
} from '@blueprintjs/core'

const StringControlTypes = ['Input', 'Select'] as const

type StringControlType = typeof StringControlTypes[number]

type SelectStringControlConfig = {
    controlType: 'Select'
    options: string[]
}

type InputStringControlConfig = {
    controlType: 'Input'
    default: string
}

type StringControlConfig = SelectStringControlConfig | InputStringControlConfig

export const Editor = () => {
    const controlType = useField('controlType', {
        defaultValue: 'Input',
    })
    const defaultValue = useField('default', {
        defaultValue: undefined,
    })
    const optionsValue = useField('options', {
        defaultValue: undefined,
        validate: (optionsStr, instance) => {
            if (instance.form.values.multiple) {
                if (!optionsStr) {
                    return `Options were required.`
                }
            }
            return false
        },
        filterValue: (value) => value && value.split('\n'),
    })

    return (
        <TitledBoard title="String Control">
            <ControlGrid>
                <ControlGridItem area="active / active / visual / visual">
                    Control
                </ControlGridItem>
                <ControlGridItem area="value / value / control / control">
                    <HTMLSelect
                        {...controlType.getInputProps()}
                        options={StringControlTypes}
                        fill
                        minimal
                    ></HTMLSelect>
                </ControlGridItem>
            </ControlGrid>
            {controlType.value === 'Input' && (
                <ControlGrid marginTop={8}>
                    <ControlGridItem area="active / active / visual / visual">
                        Default
                    </ControlGridItem>
                    <ControlGridItem area="value / value / control / control">
                        <InputGroup
                            {...defaultValue.getInputProps()}
                        ></InputGroup>
                    </ControlGridItem>
                </ControlGrid>
            )}

            {controlType.value === 'Select' && (
                <ControlGrid marginTop={8} height={60}>
                    <ControlGridItem area="active / active / visual / visual">
                        Options*
                    </ControlGridItem>
                    <ControlGridItem area="value / value / control / control">
                        <TextArea
                            {...optionsValue.getInputProps()}
                            value={(optionsValue.value || []).join('\n')}
                            style={{
                                height: 58,
                                alignSelf: 'flex-start',
                            }}
                        ></TextArea>
                    </ControlGridItem>
                </ControlGrid>
            )}
            {optionsValue.meta.error && (
                <ControlGrid marginTop={8}>
                    <ControlGridItem area="value / value / control / control">
                        <FormGroup
                            helperText={optionsValue.meta.error}
                        ></FormGroup>
                    </ControlGridItem>
                </ControlGrid>
            )}
        </TitledBoard>
    )
}

export const Renderer = ({ config, data, onChange }) => {
    return config.controlType === 'Input' ? (
        <InputGroup
            value={data || config.default}
            onChange={(event) => {
                onChange(event.target.value)
            }}
        ></InputGroup>
    ) : (
        <HTMLSelect
            value={data}
            onChange={(event) => {
                onChange(event.target.value)
            }}
            options={['', ...config.options]}
            fill
            minimal
        ></HTMLSelect>
    )
}
