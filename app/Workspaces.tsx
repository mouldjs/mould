import React, { useState, useMemo } from 'react'
import { TransformComponent } from 'react-zoom-pan-pinch'
import { Workspace as WorkspaceType, EditorState, Vector } from './types'
import { useDispatch, useSelector } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import {
    startCreating,
    finishCreating,
    updateCreating,
    moveWorkspace,
} from './appShell'
import { View } from './View'
import { tick } from './selectionTick'

export const Workspace = ({
    views,
    x,
    y,
    id,
    zoom = 1,
    positionX,
    positionY,
}: WorkspaceType) => {
    const dispatch = useDispatch()
    const creating = useSelector((state: EditorState) => state.creating)
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
        onDrag: ({ event, offset, xy, previous, initial }) => {
            const [px, py] = xy
            const [ix, iy] = initial
            if (creating?.status === 'waiting') {
                dispatch(
                    startCreating({
                        x: ix - x,
                        y: iy - y,
                    })
                )
            }

            dispatch(
                updateCreating({
                    x: px - x,
                    y: py - y,
                })
            )
        },
        onMouseDown: (event) => {
            event.stopPropagation()
        },
        onMouseUp: (event) => {
            dispatch(finishCreating())
        },
    })

    const VS = useMemo(
        () =>
            Object.values(views).map((viewId) => {
                return <View key={`${viewId}-${zoom}`} viewId={viewId}></View>
            }),
        [views]
    )

    return (
        <div
            style={{
                position: 'relative',
                height: '100vh',
                background: '#f1f1f1',
            }}
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
                    {VS}
                    {creation && (
                        <div
                            style={{
                                position: 'absolute',
                                background: '#fff',
                                transform: `translateX(${creation.x}px) translateY(${creation.y}px)`,
                                width: creation.width,
                                height: creation.height,
                            }}
                        ></div>
                    )}
                </div>
            </TransformComponent>
        </div>
    )
}
