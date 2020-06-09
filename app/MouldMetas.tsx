import React, { useState } from 'react'
import { EditorState } from './types'
import { DropdownMenu, Button, Menu, MenuItem } from '@modulz/radix'
import { useCurrentMould } from './utils'
import { TitledBoard } from '../inspector/FormComponents'
import { useDispatch, useSelector } from 'react-redux'
import { addInput } from './appShell'
import { MouldInput } from './MouldInput'
import { Plus } from 'react-feather'
import Controls from '../controls'

const InputTypes = Object.keys(Controls)

export const MouldMetas = () => {
    const dispatch = useDispatch()
    const mould = useCurrentMould()
    const [addingControlType, setAddingControlType] = useState<string | null>(
        null
    )
    if (!mould) {
        return null
    }

    return (
        <TitledBoard
            title="Metas"
            renderTitle={() => {
                return (
                    <>
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
                                    {InputTypes.map((controlType) => {
                                        return (
                                            <MenuItem
                                                onSelect={() => {
                                                    setAddingControlType(
                                                        controlType
                                                    )
                                                }}
                                                label={controlType}
                                            ></MenuItem>
                                        )
                                    })}
                                </Menu>
                            }
                        ></DropdownMenu>
                        {addingControlType && (
                            <MouldInput
                                isOpen={!!(addingControlType as any)}
                                onClose={() => {
                                    setAddingControlType(null)
                                }}
                                type={addingControlType as string}
                                onSubmit={(name, config) => {
                                    dispatch(
                                        addInput({
                                            inputKey: name,
                                            config,
                                            mouldName: mould.name,
                                        })
                                    )
                                }}
                            ></MouldInput>
                        )}
                    </>
                )
            }}
        >
            will be removed
        </TitledBoard>
    )
}
