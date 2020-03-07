import React, { useState } from 'react'
import { View as ViewType, EditorState, Vector } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import { useIsSelectedMould, useIsSelectedState } from './utils'
import { ResizableBox } from 'react-resizable'
import { resizeView, dragView } from './appShell'
import { Box, Text } from '@modulz/radix'
import Mould from './Mould'

export const View = ({ viewId }: { viewId: string }) => {
    const dispatch = useDispatch()
    const { mouldId, state, x, y, width, height } = useSelector(
        (state: EditorState) => state.views[viewId]
    )
    const mould = useSelector((state: EditorState) => state.moulds[mouldId])
    const [startDragPoint, setStartDragPoint] = useState<null | Vector>(null)
    const [startPoint, setStartPoint] = useState({ x, y })
    const bind = useGesture({
        onMouseDown: event => {
            setStartDragPoint({
                x: event.clientX,
                y: event.clientY,
            })
            setStartPoint({ x, y })
        },
        onMouseUp: () => setStartDragPoint(null),
        onDrag: ({ event }) => {
            if (startDragPoint) {
                dispatch(
                    dragView({
                        id: viewId,
                        x:
                            (event as any).clientX -
                            startDragPoint.x +
                            startPoint.x,
                        y:
                            (event as any).clientY -
                            startDragPoint.y +
                            startPoint.y,
                    })
                )
            }
        },
    })
    // const dispatch = useDispatch()
    // const isSelectedState = useIsSelectedState(mouldId, state)
    // const isSelectedMould = useIsSelectedMould(mouldId)

    // return      <ResizableBox
    //     width={width}
    //     height={height}
    //     onResize={(e, { size: { width, height } }) => {
    //         dispatch(
    //             resizeView({
    //                 viewId,
    //                 width,
    //                 height,
    //             })
    //         )
    //     }}
    // >

    return (
        <Box
            boxShadow="0px 0px 5px #aaaaaa"
            position="absolute"
            width={width}
            height={height}
            bg="white"
            left={x}
            top={y}
        >
            <div
                {...bind()}
                // onMouseDown={event => {
                //     setStartDragPoint({
                //         x: event.clientX,
                //         y: event.clientY,
                //     })
                //     setStartPoint({ x, y })
                // }}
                // onMouseUp={() => setStartDragPoint(null)}
                // onMouseMove={event => {
                //     if (startDragPoint) {
                //         dispatch(
                //             dragView({
                //                 id: viewId,
                //                 x:
                //                     event.clientX -
                //                     startDragPoint.x +
                //                     startPoint.x,
                //                 y:
                //                     event.clientY -
                //                     startDragPoint.y +
                //                     startPoint.y,
                //             })
                //         )
                //     }
                // }}
                style={{ cursor: 'grab', position: 'absolute', top: -20 }}
            >
                <Text truncate size={1} textColor="rgb(132,132,132)">
                    {state}
                </Text>
            </div>
            <Mould editable {...mould} currentState={state}></Mould>
        </Box>
    )
    // </ResizableBox>
}
