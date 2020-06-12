import React from 'react'
import { useField } from 'react-form'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../inspector/FormComponents'
import { Switch, InputGroup, Toaster, Intent } from '@blueprintjs/core'
import { delay } from 'lodash'

export const Editor = () => {
    const defaultValue = useField('default', {
        defaultValue: undefined,
    })

    return (
        <TitledBoard title="Function Control">
            <ControlGrid marginTop={8}>
                <ControlGridItem area="active / active / visual / visual">
                    Default
                </ControlGridItem>
                <ControlGridItem area="value / value / control / control">
                    <InputGroup {...defaultValue.getInputProps()}></InputGroup>
                </ControlGridItem>
            </ControlGrid>
        </TitledBoard>
    )
}

export const Renderer = ({ config, data, onChange }) => {
    const isShow = data && data.checked
    const toastProps = {
        timeout: 1000,
        message: `Debug: ${(data && data.txt) || config.default}`,
        intent: Intent.PRIMARY,
        onDismiss: () => {
            delay(() => onChange({ checked: false }), 200)
        },
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
            }}
        >
            <InputGroup
                value={(data && data.txt) || config.default}
                onChange={(event) => {
                    onChange({ txt: event.target.value })
                }}
            />
            <Switch
                large
                alignIndicator="right"
                checked={isShow}
                onChange={(e) => {
                    onChange({ checked: e.currentTarget.checked })
                }}
            />
            {isShow && <Toaster ref={(ref) => ref?.show({ ...toastProps })} />}
        </div>
    )
}
