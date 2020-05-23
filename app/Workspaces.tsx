import React, { useState, useRef, DOMElement, useEffect } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Box } from '@modulz/radix'
import { Workspace as WorkspaceType, EditorState, Vector } from './types'
import { createAction, handleAction } from 'redux-actions'
import { initialData } from './utils'
import { useDispatch, useSelector } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import {
    selectComponent,
    startCreating,
    finishCreating,
    updateCreating,
} from './appShell'
import { View } from './View'
import { tick } from './selectionTick'

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
    const creating = useSelector((state: EditorState) => {
        return state.creating
    })

    const creation = creating && creating.view
    const [xy, setXY] = useState([x, y])
    const bind = useGesture({
        onWheel: ({ last, movement }) => {
            const xy = [x - movement[0], y - movement[1]]
            setXY(xy)
            if (last) {
                dispatch(moveWorkspace({ id, x: xy[0], y: xy[1] }))
            }
        },
        onDrag: ({ event }) => {
            event!.stopPropagation()
            dispatch(
                updateCreating({
                    x: (event as any).offsetX - x,
                    y: (event as any).offsetY - y,
                })
            )
        },
        onMouseDown: (event) => {
            event.stopPropagation()
            dispatch(
                startCreating({
                    x: event.nativeEvent.offsetX - x,
                    y: event.nativeEvent.offsetY - y,
                })
            )
        },
        onMouseUp: (event) => {
            // event.stopPropagation()
            dispatch(finishCreating())
        },
    })

    const vs = Object.values(views).map((viewId) => {
        return <View key={viewId} viewId={viewId}></View>
    })

    return (
        <TransformWrapper
            options={{
                limitToBounds: true,
                transformEnabled: true,
                disabled: false,
                limitToWrapper: false,
                minScale: 0.1,
                maxScale: 3,
                centerContent: false,
            }}
            pan={{
                disabled: true,
            }}
            step={100}
            pinch={{ disabled: true }}
            doubleClick={{ disabled: true }}
            wheel={{
                disabled: false,
                wheelEnabled: false,
                touchPadEnabled: true,
                limitsOnWheel: false,
                step: 30,
                animation: false,
            }}
        >
            <Box
                translate
                bg="#f1f1f1"
                height="100vh"
                position="relative"
                {...bind()}
                onDoubleClick={() => {
                    tick((data = []) => data)
                }}
            >
                <TransformComponent>
                    <div
                        style={{
                            position: 'inherit',
                            width: '100vw',
                            height: '100vh',
                            top: 0,
                            left: 0,
                            transform: `translate(${xy[0]}px,${xy[1]}px)`,
                        }}
                    >
                        {vs}
                        {creation && (
                            <Box
                                position="absolute"
                                bg="white"
                                style={{
                                    left: creation.x,
                                    top: creation.y,
                                    width: creation.width,
                                    height: creation.height,
                                }}
                            >
                                {/* <Mould editable {...mould} currentState={state}></Mould> */}
                            </Box>
                        )}
                    </div>
                </TransformComponent>
            </Box>
        </TransformWrapper>
    )
}
