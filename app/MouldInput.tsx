import React, { useState, useMemo } from 'react'
import { useForm, useField } from 'react-form'
import {
    Drawer,
    InputGroup,
    HTMLSelect,
    Button as BButton,
    FormGroup,
} from '@blueprintjs/core'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../inspector/FormComponents'
import MouldApp from '../mould'
import { useCurrentMould } from './utils'
import { omit } from 'ramda'

const InputTypes = Object.keys(MouldApp.Controls)

const NameField = ({ origin }) => {
    const mould = useCurrentMould()
    const {
        meta: { error },
        getInputProps,
    } = useField('name', {
        validate: (name) => {
            const names = Object.keys(mould?.input || [])
            if (names.includes(name) && name !== origin) {
                return `Input ${name} already added!`
            }
            if (!name) {
                return `Name was required.`
            }

            return false
        },
    })

    return (
        <>
            <ControlGrid>
                <ControlGridItem area="active / active / visual / visual">
                    Name*
                </ControlGridItem>
                <ControlGridItem area="value / value / control / control">
                    <InputGroup {...getInputProps()}></InputGroup>
                </ControlGridItem>
            </ControlGrid>
            {error && (
                <ControlGrid marginTop={8}>
                    <ControlGridItem area="value / value / control / control">
                        <FormGroup helperText={error}></FormGroup>
                    </ControlGridItem>
                </ControlGrid>
            )}
        </>
    )
}

export const MouldInput = ({
    name = '',
    type,
    onClose,
    isOpen,
    onSubmit,
}: {
    name?: string
    type?: string
    onClose: () => void
    isOpen: boolean
    onSubmit: (name, config) => void
}) => {
    const mould = useCurrentMould()
    const defaultValues = useMemo(() => {
        return mould && name && mould.input[name]
            ? omit(['type'], { ...mould.input[name], name })
            : undefined
    }, [mould?.name, name])
    const [addingControlType, setAddingControlType] = useState<string | null>(
        type || mould!.input[name].type
    )
    const ControlEditPanel = addingControlType
        ? MouldApp.getControl(addingControlType).Editor
        : null
    const {
        Form,
        meta: { canSubmit },
        setValues,
        getFieldValue,
    } = useForm({
        onSubmit: (values) => {
            onClose()
            const type = addingControlType
            setAddingControlType(null)
            if (!mould) {
                return
            }
            const { name, ...rest } = values
            onSubmit(name, {
                type,
                ...rest,
            })
        },
        defaultValues,
    })

    return (
        <Drawer
            onClose={onClose}
            isOpen={isOpen}
            size={215}
            hasBackdrop={false}
            style={{ background: '#e1e1e1', top: 50 }}
            position="right"
        >
            <Form>
                <TitledBoard title="Input">
                    <NameField origin={name}></NameField>
                    <ControlGrid marginTop={8}>
                        <ControlGridItem area="active / active / visual / visual">
                            Type
                        </ControlGridItem>
                        <ControlGridItem area="value / value / control / control">
                            <HTMLSelect
                                onChange={(event) => {
                                    setAddingControlType(event.target.value)
                                    setValues({
                                        name: getFieldValue('name'),
                                    })
                                }}
                                value={addingControlType as string}
                                options={InputTypes}
                                minimal
                                fill
                            ></HTMLSelect>
                        </ControlGridItem>
                    </ControlGrid>
                </TitledBoard>
                {ControlEditPanel && <ControlEditPanel />}
                <div style={{ width: '100%', padding: 8 }}>
                    <BButton
                        disabled={!canSubmit}
                        type="submit"
                        intent="success"
                        text="Submit"
                        fill
                    ></BButton>
                </div>
            </Form>
        </Drawer>
    )
}
