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

export const Renderer = ({ config, onChange }) => {
    const [checked, setChecked] = useState(config.default)

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Switch
                large
                checked={checked}
                onChange={(e) => {
                    const value = e.currentTarget.checked

                    setChecked(value)
                    onChange(value)
                }}
            />
        </div>
    )
}
