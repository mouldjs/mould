import React, { useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Box } from '@modulz/radix'
import { Workspace as WorkspaceType, EditorState, Vector } from './types'
import { ArcherContainer, ArcherElement } from 'react-archer'
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

type ZoomWorkspaceActionType = { zoom: number }
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
    const { views: viewMap, creating, viewRelationsMap } = useSelector(
        (state: EditorState) => state
    )
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

    const [viewCacheKey, setViewCacheKey] = useState('')

    const vs = Object.values(views).map((viewId) => {
        const { width, height, x, y } = viewMap[viewId]
        const relations = viewRelationsMap[viewId]

        return (
            <>
                <div style={{ position: 'absolute', zIndex: 1 }}>
                    <ArcherElement
                        id={`archer-${viewId}`}
                        relations={relations}
                        style={{
                            position: 'absolute',
                            width,
                            height,
                            left: x,
                            top: y,
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: 0,
                                height: 0,
                                left: -1 * x,
                                top: -1 * y,
                            }}
                        >
                            <View
                                key={`${viewId}-${viewCacheKey}`}
                                viewId={viewId}
                            ></View>
                        </div>
                    </ArcherElement>
                </div>
            </>
        )
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
            pinch={{ disabled: true }}
            doubleClick={{ disabled: true }}
            wheel={{
                disabled: false,
                wheelEnabled: false,
                touchPadEnabled: true,
                limitsOnWheel: false,
                step: 30,
            }}
            onWheelStop={(e) => {
                const zoom = e.scale

                setViewCacheKey(zoom)
                zoomWorkspace({ zoom })
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
                <ArcherContainer
                    strokeColor="#aaa"
                    strokeWidth={1}
                    arrowLength={0}
                    arrowThickness={0}
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
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: creation.x,
                                        top: creation.y,
                                        width: creation.width,
                                        height: creation.height,
                                        background: '#fff',
                                    }}
                                ></div>
                            )}
                        </div>
                    </TransformComponent>
                </ArcherContainer>
            </Box>
        </TransformWrapper>
    )
}
