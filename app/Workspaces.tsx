import React, { useState, useMemo, useEffect } from 'react'
import { Workspace as WorkspaceType, EditorState } from './types'
import { useDispatch, useSelector } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import {
    startCreating,
    finishCreating,
    updateCreating,
    moveWorkspace,
    zoomWorkspace,
} from './appShell'
import { View } from './View'
import { tick } from './selectionTick'
import useClientRect from '../lib/useClientRect'

export const Workspace = ({ views, x, y, zoom = 1 }: WorkspaceType) => {
    const dispatch = useDispatch()
    const creating = useSelector((state: EditorState) => state.creating)
    const creation = creating && creating.view
    const [zoomOffset, setZoomOffset] = useState([x, y])

    const [scaling, setScaling] = useState(zoom)

    const STEP = 0.99
    const MAX_SCALE = 5
    const MIN_SCALE = 0.01

    useEffect(() => {
        if (zoom !== scaling) {
            setScaling(zoom)
        }
    }, [zoom])

    const [wrapperRect, wrapperRef] = useClientRect()
    const contentRefDOM =
        typeof window !== 'undefined'
            ? document.getElementById('contentRefDOM')
            : null

    const originCenterX = wrapperRect
        ? wrapperRect.left + wrapperRect.width / 2
        : 0
    const originCenterY = wrapperRect
        ? wrapperRect.top + wrapperRect.height / 2
        : 0

    const bind = useGesture({
        onWheel: ({ last, delta }) => {
            const xy = [zoomOffset[0] - delta[0], zoomOffset[1] - delta[1]]
            setZoomOffset(xy)
            if (last) {
                dispatch(moveWorkspace({ x: xy[0], y: xy[1] }))
            }
        },
        onDrag: ({ xy, initial }) => {
            const [px, py] = xy
            const [ix, iy] = initial
            if (creating?.status === 'waiting') {
                dispatch(
                    startCreating({
                        x: ix - x,
                        y: iy - y,
                    })
                )
            } else if (creating?.status === 'updating') {
                dispatch(
                    updateCreating({
                        x: px - x,
                        y: py - y,
                    })
                )
            }
        },
        onMouseDown: (event) => {
            event.stopPropagation()
        },
        onMouseUp: (event) => {
            if (creating?.status !== 'updating') {
                return
            }
            dispatch(finishCreating())
        },
        onPinch: (e) => {
            const origin = e.origin
            const factor = e.delta[1]

            if (
                (scaling >= MAX_SCALE && factor < 0) ||
                (scaling <= MIN_SCALE && factor > 0)
            )
                return

            const changed = Math.pow(STEP, factor)

            const contentRect =
                contentRefDOM && contentRefDOM.getBoundingClientRect()
            const currentCenterX = contentRect
                ? contentRect.left + contentRect.width / 2
                : 0
            const currentCenterY = contentRect
                ? contentRect.top + contentRect.height / 2
                : 0

            const mousePosToCurrentCenterDistanceX = origin
                ? origin[0] - currentCenterX
                : 0
            const mousePosToCurrentCenterDistanceY = origin
                ? origin[1] - currentCenterY
                : 0

            const newCenterX =
                currentCenterX +
                mousePosToCurrentCenterDistanceX * (1 - changed)
            const newCenterY =
                currentCenterY +
                mousePosToCurrentCenterDistanceY * (1 - changed)

            const offsetX = newCenterX - originCenterX
            const offsetY = newCenterY - originCenterY

            setScaling(scaling * changed)
            setZoomOffset([offsetX, offsetY])

            if (e.last) {
                dispatch(moveWorkspace({ x: offsetX, y: offsetY }))
                dispatch(zoomWorkspace({ zoom: scaling }))
            }
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
            ref={wrapperRef}
            style={{
                position: 'absolute',
                height: '100vh',
                width: '100vw',
                background: '#f1f1f1',
            }}
            {...bind()}
            onDoubleClick={() => {
                tick((data = []) => data)
            }}
        >
            <div
                id="contentRefDOM"
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                    transform: `translate(${zoomOffset[0]}px, ${zoomOffset[1]}px) scale(${scaling})`,
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
        </div>
    )
}
