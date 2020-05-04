import React, { useState } from 'react'
import { Input, DropdownMenu, Button, Menu, MenuItem } from '@modulz/radix'
import { useCurrentMould } from './utils'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { useDispatch } from 'react-redux'
import { modifyMeta, addInput } from './appShell'
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
                                            mouldId: mould.id,
                                        })
                                    )
                                }}
                            ></MouldInput>
                        )}
                    </>
                )
            }}
        >
            <Cell label="name">
                <Input
                    key={mould.id}
                    value={mould.name}
                    onChange={(e) => {
                        dispatch(
                            modifyMeta({
                                mouldId: mould.id,
                                name: e.target.value,
                            })
                        )
                    }}
                ></Input>
            </Cell>
            <Cell label="function">
                <Input
                    key={mould.id}
                    value={mould.hookFunctionName}
                    onChange={(e) => {
                        dispatch(
                            modifyMeta({
                                mouldId: mould.id,
                                hookFunctionName: e.target.value,
                            })
                        )
                    }}
                ></Input>
            </Cell>
        </TitledBoard>
    )
}
