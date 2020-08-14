import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { EditorState } from '../../app/types'
import { pauseDebugging, updateDebugging } from '../../app/appShell'
import { useCurrentView } from '../utils'
import { Play, Pause } from 'react-feather'

export default () => {
    const dispatch = useDispatch()
    const currentView = useCurrentView()
    const debugging = useSelector((state: EditorState) => state.debugging)
    const isDebugging = !!debugging[0]

    return (
        <div
            className="m-r clickable"
            onClick={() => {
                if (isDebugging) {
                    dispatch(pauseDebugging())
                } else {
                    if (currentView) {
                        dispatch(
                            updateDebugging({
                                mouldName: currentView.mouldName,
                                stateName: currentView.state,
                            })
                        )
                    }
                }
            }}
        >
            {!isDebugging ? (
                <Play color="#fff"></Play>
            ) : (
                <Pause color="#fff"></Pause>
            )}
        </div>
    )
}
