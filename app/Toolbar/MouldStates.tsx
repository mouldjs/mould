import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@modulz/radix'
import { Plus } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { EditorState } from '../types'
import { waitingForCreating } from '../appShell'

const MouldStates = () => {
    const [mould, state] = useSelector((state: EditorState) => {
        const [[mouldId, currentState]] = state.selection || [[]]

        return [state.moulds[mouldId || -1], currentState]
    })
    const dispatch = useDispatch()

    return mould ? (
        <ToggleButtonGroup value={state} style={{ width: 'auto' }}>
            {[
                <ToggleButton
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
                    value=""
                    translate
                >
                    <Plus></Plus>
                </ToggleButton>,
                ...Object.keys(mould.states || {}).map((state) => {
                    return (
                        <ToggleButton value={state} translate>
                            {state}
                        </ToggleButton>
                    )
                }),
            ]}
        </ToggleButtonGroup>
    ) : null
}

export default MouldStates
