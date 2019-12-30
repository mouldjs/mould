import React, { useState, useRef, DOMElement, useEffect } from 'react'
import { Box } from '@modulz/radix'
import { Workspace as WorkspaceType, EditorState, Vector } from './types'
// import { ViewGroup } from './ViewGroup'
import { createAction, handleAction } from 'redux-actions'
import { initialData } from './utils'
import { useDispatch } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring'
import { selectComponent } from './appShell'
import { View } from './View'

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

export const Workspace = ({ views, x, y, id, zoom = 1 }: WorkspaceType) => {
    const dispatch = useDispatch()
    const [xy, setXY] = useState([x, y])
    const [scale, setScale] = useState(zoom)
    const bind = useGesture(
        {
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
            onPinch: ({ da: [d, a] }) => {
                setScale((d + zoom * 200) / 200)
            },
        },
        {
            pinch: {
                initial: [200, 1],
            } as any,
        }
    )

    const vs = Object.values(views).map(viewId => {
        return <View key={viewId} viewId={viewId}></View>
    })

    return (
        <Box
            bg="#f1f1f1"
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
                {vs}
            </div>
        </Box>
    )
}
