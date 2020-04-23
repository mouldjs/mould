import React from 'react'
import { PlusCircle } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { EditorState } from './types'
import { waitingForCreating } from './appShell'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Text } from '@modulz/radix'
export const MouldStates = () => {
    const [mould, state] = useSelector((state: EditorState) => {
        const [[mouldId, currentState]] = state.selection || [[]]

        return [state.moulds[mouldId || -1], currentState]
    })
    const dispatch = useDispatch()

    const wrapperStyle = {
        position: 'absolute',
        right: '215px',
        height: '100%',
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
        boxShadow: '5px 5px 5px #ddd',
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
    } as React.CSSProperties

    const currentMouldStyle = {
        ...listItemStyle,
        color: '#000',
        fontSize: '16px',
        borderBottom: '1px solid #e0e0e0',
    } as React.CSSProperties

    const currentStateStyle = {
        ...listItemStyle,
        fontWeight: 700,
        color: '#333',
    } as React.CSSProperties

    return mould ? (
        <div style={wrapperStyle}>
            <div>
                <ul style={listStyle}>
                    {[
                        <li style={currentMouldStyle}>{mould.name}</li>,
                        ...Object.keys(mould.states || {}).map((s) => {
                            return (
                                <li
                                    style={
                                        s === state
                                            ? currentStateStyle
                                            : listItemStyle
                                    }
                                >
                                    {s}
                                </li>
                            )
                        }),
                        <Popover interactionKind={PopoverInteractionKind.HOVER}>
                            <li
                                style={listItemStyle}
                                onClick={() => {
                                    dispatch(
                                        waitingForCreating({
                                            mouldId: mould.id,
                                            stateName: `state ${
                                                Object.keys(mould.states).length
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
}
