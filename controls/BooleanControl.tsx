import React, { useState } from 'react'
import { useField } from 'react-form'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../inspector/FormComponents'
import { Switch } from '@blueprintjs/core'

export const Editor = () => {
    const defaultValue = useField('default', {
        defaultValue: false,
    })

    return (
        <TitledBoard title="Boolean Control">
            <ControlGrid marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    Default
                </ControlGridItem>
                <ControlGridItem area="value / value / control / control">
                    <Switch
                        large
                        {...defaultValue.getInputProps()}
                        onChange={(e) =>
                            defaultValue.setValue(e.currentTarget.checked)
                        }
                    />
                </ControlGridItem>
            </ControlGrid>
        </TitledBoard>
    )
}

export const Renderer = ({ config, data, onChange }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Switch
                large
                checked={data === undefined ? config.default : data}
                onChange={(e) => {
                    const value = e.currentTarget.checked

                    onChange(value)
                }}
            />
        </div>
    )
}
