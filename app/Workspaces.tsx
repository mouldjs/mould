import React, { useState, useRef, DOMElement, useEffect } from 'react'
import { Box } from '@modulz/radix'
import { Workspace as WorkspaceType, EditorState, Vector } from './types'
import { ViewGroup } from './ViewGroup'
import { createAction, handleAction } from 'redux-actions'
import { initialData } from './utils'
import { useDispatch } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import { selectComponent } from './appShell'

type MoveWorkspaceActionType = { id: string } & Vector
const MOVE_WORKSPACE = 'MOVE_WORKSPACE'
const moveWorkspace = createAction<MoveWorkspaceActionType>(MOVE_WORKSPACE)
export const handleMoveWorkspace = handleAction<
    EditorState,
    MoveWorkspaceActionType
>(
    MOVE_WORKSPACE,
    (state, action) => {
        state.testWorkspace.x = action.payload.x
        state.testWorkspace.y = action.payload.y

        return state
    },
    initialData
)

type ZoomWorkspaceActionType = { id: string; zoom: number }
const ZOOM_WORKSPACE = 'ZOOM_WORKSPACE'
const zoomWorkspace = createAction<ZoomWorkspaceActionType>(ZOOM_WORKSPACE)
export const handleZoomWorkspace = handleAction<
    EditorState,
    ZoomWorkspaceActionType
>(
    ZOOM_WORKSPACE,
    (state, action) => {
        state.testWorkspace.zoom = action.payload.zoom

        return state
    },
    initialData
)

export const Workspace = ({
    viewGroups,
    x,
    y,
    id,
    zoom = 1,
}: WorkspaceType) => {
    const dispatch = useDispatch()
    const [xy, setXY] = useState([x, y])
    const [scale, setScale] = useState(zoom)
    const bind = useGesture({
        // onDrag: ({ last, movement }) => {
        //     const xy = [x + movement[0], y + movement[1]]
        //     setXY(xy)
        //     if (last) {
        //         dispatch(moveWorkspace({ id, x: xy[0], y: xy[1] }))
        //     }
        // },
        onWheel: ({ last, movement }) => {
            const xy = [x - movement[0], y - movement[1]]
            setXY(xy)
            if (last) {
                dispatch(moveWorkspace({ id, x: xy[0], y: xy[1] }))
            }
        },
        onPinch: ({ da: [d, a], origin, memo = 0 }) => {
            const s = scale * (d / memo)
            console.log(d, a, origin, memo, s)
            setScale(s)

            return d
        },
    })

    const groups = Object.values(viewGroups).map(viewGroupId => {
        return <ViewGroup key={viewGroupId} id={viewGroupId}></ViewGroup>
    })

    return (
        <Box
            bg="white"
            height="100vh"
            overflow="hidden"
            position="relative"
            {...bind()}
            onDoubleClick={() => {
                dispatch(selectComponent({ selection: undefined }))
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    left: xy[0],
                    top: xy[1],
                    zoom: scale,
                }}
            >
                {groups}
            </div>
        </Box>
    )
}
