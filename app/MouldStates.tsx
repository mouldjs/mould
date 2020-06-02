import React, { useState, useEffect } from 'react'
import { PlusCircle } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { waitingForCreating, modifyStateName, modifyMeta } from './appShell'
import {
    Popover,
    PopoverInteractionKind,
    EditableText,
} from '@blueprintjs/core'
import { Text, Input } from '@modulz/radix'
import { Path, EditorState } from './types'
import { useCurrentMould, useCurrentState } from './utils'
import { selectComponent } from './appShell'
export const MouldStates = () => {
    const mould = useCurrentMould()
    const state = useCurrentState()
    const dispatch = useDispatch()
    const moulds = useSelector((state: EditorState) => state.moulds)

    const wrapperStyle = {
        position: 'absolute',
        right: '215px',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        paddingTop: 40,
        paddingRight: 30,
        zIndex: 1,
    } as React.CSSProperties

    const listStyle = {
        maxHeight: '600px',
        margin: 0,
        overflow: 'auto',
        display: 'block',
        borderRadius: '5px',
        background: '#eee',
        padding: '5px',
        color: '#333',
    } as React.CSSProperties

    const listItemStyle = {
        width: '120px',
        minHeight: '28px',
        fontSize: '13px',
        color: '#666',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto',
        cursor: 'pointer',
        textAlign: 'center',
    } as React.CSSProperties

    const currentMouldStyle = {
        ...listItemStyle,
        color: '#000',
        fontSize: '16px',
        borderBottom: '1px solid #bbb',
        cursor: 'default',
        margin: '0 auto',
    } as React.CSSProperties

    const currentStateStyle = {
        ...listItemStyle,
        color: '#333',
        cursor: 'text',
        outline: 'none',
        fontWeight: 700,
        border: '1px solid #56a9f1',
    } as React.CSSProperties

    const [inputValue, setInputValue] = useState('')
    const [mouldName, setMouldName] = useState(mould?.name)

    const mouldNames = Object.keys(moulds).map((m) => moulds[m].name)

    useEffect(() => {
        mould && setMouldName(mould.name)
    }, [mould])

    if (mould) {
        const currentStates = mould.states || {}
        const stateList = Object.keys(currentStates)
        const selectView = ({ mouldId, stateName }) => {
            const path: Path = [[mouldId, stateName], []]
            const pathData: any = [path]
            dispatch(
                selectComponent({
                    pathes: pathData,
                })
            )
        }
        const updateStateName = ({ name, stateName, mouldId }) => {
            if (!name || name === stateName) {
                setInputValue('')
                return
            }

            const existed = currentStates.hasOwnProperty(name)
            if (existed) {
                setInputValue('')
                return
            }

            state &&
                dispatch(
                    modifyStateName({
                        mouldId,
                        stateName,
                        name,
                    })
                )
            setInputValue('')
            selectView({ mouldId, stateName: name })
        }

        return mould ? (
            <div style={wrapperStyle}>
                <div
                    style={{
                        boxShadow: '5px 5px 5px #ddd',
                        maxHeight: '600px',
                    }}
                >
                    <div style={currentMouldStyle}>
                        <EditableText
                            className="mould-name"
                            type="text"
                            value={mouldName}
                            placeholder="Name this Mould"
                            onConfirm={() => {
                                if (!mouldName) {
                                    setMouldName(mould.name)
                                    return
                                }
                                if (mouldNames.includes(mouldName)) {
                                    setMouldName(mould.name)
                                    return
                                }
                                dispatch(
                                    modifyMeta({
                                        mouldId: mould.id,
                                        name: mouldName,
                                    })
                                )
                            }}
                            onChange={(value) => {
                                setMouldName(value)
                            }}
                            onEdit={() => {
                                mould.name && setMouldName(mould.name)
                            }}
                            confirmOnEnterKey={true}
                            selectAllOnFocus={true}
                        ></EditableText>
                    </div>
                    <ul style={listStyle}>
                        {[
                            ...stateList.map((stateName) => {
                                const isActive = stateName === state

                                if (isActive) {
                                    return (
                                        <Input
                                            className="editable-state"
                                            style={currentStateStyle}
                                            type="text"
                                            key={stateName}
                                            value={inputValue}
                                            placeholder={stateName}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.target.blur()
                                                }
                                            }}
                                            onFocus={() => {
                                                setInputValue(stateName)
                                            }}
                                            onChange={(e) => {
                                                setInputValue(e.target.value)
                                            }}
                                            onBlur={() => {
                                                updateStateName({
                                                    name: inputValue,
                                                    stateName,
                                                    mouldId: mould.id,
                                                })
                                            }}
                                        ></Input>
                                    )
                                } else {
                                    return (
                                        <li
                                            key={stateName}
                                            onClick={() => {
                                                selectView({
                                                    mouldId: mould.id,
                                                    stateName,
                                                })
                                            }}
                                            style={listItemStyle}
                                        >
                                            {stateName}
                                        </li>
                                    )
                                }
                            }),
                            <Popover
                                key="Popover"
                                interactionKind={PopoverInteractionKind.HOVER}
                            >
                                <li
                                    style={listItemStyle}
                                    onClick={() => {
                                        dispatch(
                                            waitingForCreating({
                                                mouldId: mould.id,
                                                stateName: `state ${
                                                    Object.keys(mould.states)
                                                        .length
                                                }`,
                                            })
                                        )
                                    }}
                                >
                                    <PlusCircle></PlusCircle>
                                </li>
                                <Text
                                    size={2}
                                    as="p"
                                    p={5}
                                    sx={{ color: '#666', lineHeight: '1.3' }}
                                >
                                    Tips: Hit S and easy drag a new state!
                                </Text>
                            </Popover>,
                        ]}
                    </ul>
                </div>
            </div>
        ) : null
    } else {
        return null
    }
}
