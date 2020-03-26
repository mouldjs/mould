import React, { useState, useRef, useMemo } from 'react'
import { View as ViewType, EditorState, Vector, Path } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import dynamic from 'next/dynamic'
import { Play, Pause } from 'react-feather'
import {
    useIsSelectedMould,
    useIsSelectedState,
    useIsIncludePath,
    useIsSelectedPath,
} from './utils'
import { ResizableBox } from 'react-resizable'
import { resizeView, dragView, selectComponent } from './appShell'
import { Box, Text, Input } from '@modulz/radix'
import Mould from './Mould'
import { useDrag } from 'react-dnd'
import DebugPanel from './DebugPanel'
import { TitledBoard, Cell } from '../inspector/FormComponents'
import { runtime } from '../runtime'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
})

export const View = ({ viewId }: { viewId: string }) => {
    const dispatch = useDispatch()
    const { mouldId, state, x, y, width, height } = useSelector(
        (state: EditorState) => state.views[viewId]
    )
    const moulds = useSelector((state: EditorState) => state.moulds)
    const [, drag] = useDrag({
        item: { type: 'TREE', name: 'Mould', props: { __mouldId: mouldId } },
    })
    const path: Path = [[mouldId, state], []]
    const mould = useSelector((state: EditorState) => state.moulds[mouldId])
    const included = useIsIncludePath(path)
    const selected = useIsSelectedPath(path)
    const viewRef = useRef()
    const [paused, setPaused] = useState(true)
    const [inputValue, setInputValue] = useState({})
    const RuntimeMould = useMemo(() => runtime(moulds), [moulds])

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
        <>
            {selected && viewRef.current && (
                <>
                    <Moveable
                        target={viewRef.current}
                        resizable
                        draggable
                        origin={false}
                        throttleResize={0}
                        // keepRatio={true}
                        onResize={({
                            target,
                            width,
                            height,
                            dist: [mx, my],
                            direction: [dx, dy],
                        }) => {
                            // dispatch(resizeView({ viewId, width, height }))
                            // if (dx === -1 || dy === -1) {
                            //     dispatch(
                            //         dragView({
                            //             id: viewId,
                            //             x: dx === -1 ? x - mx : x,
                            //             y: dy === -1 ? y - my : y,
                            //         })
                            //     )
                            // }
                            target.style.width = width + 'px'
                            target.style.height = height + 'px'
                            target.style.left = (dx === -1 ? x - mx : x) + 'px'
                            target.style.top = (dy === -1 ? y - my : y) + 'px'
                        }}
                        onResizeEnd={({ target }) => {
                            dispatch(
                                resizeView({
                                    viewId,
                                    width: parseFloat(target.style.width),
                                    height: parseFloat(target.style.height),
                                })
                            )
                            dispatch(
                                dragView({
                                    id: viewId,
                                    x: parseFloat(target.style.left),
                                    y: parseFloat(target.style.top),
                                })
                            )
                        }}
                        onDrag={({ target, left, top }) => {
                            target.style.left = left + 'px'
                            target.style.top = top + 'px'
                        }}
                        onDragEnd={({ target }) => {
                            dispatch(
                                dragView({
                                    id: viewId,
                                    x: parseFloat(target.style.left),
                                    y: parseFloat(target.style.top),
                                })
                            )
                        }}
                        style={{
                            pointerEvents: !paused ? 'none' : 'auto',
                        }}
                    ></Moveable>
                    <DebugPanel.Source>
                        <TitledBoard
                            title="Debug"
                            renderTitle={(collspaed) => {
                                if (collspaed) {
                                    return null
                                }

                                return (
                                    <div onClick={() => setPaused(!paused)}>
                                        {paused ? (
                                            <Play
                                                size={14}
                                                color="#959595"
                                            ></Play>
                                        ) : (
                                            <Pause
                                                size={14}
                                                color="#959595"
                                            ></Pause>
                                        )}
                                    </div>
                                )
                            }}
                        >
                            {mould.input.map((input) => {
                                return (
                                    <Cell label={input}>
                                        <Input
                                            value={inputValue[input]}
                                            onChange={(e) => {
                                                setInputValue({
                                                    ...inputValue,
                                                    [input]: e.target.value,
                                                })
                                            }}
                                        ></Input>
                                    </Cell>
                                )
                            })}
                        </TitledBoard>
                    </DebugPanel.Source>
                </>
            )}
            <Box
                // id={viewId}
                ref={viewRef}
                boxShadow="0px 0px 5px #aaaaaa"
                position="absolute"
                width={width}
                height={height}
                bg="white"
                left={x}
                top={y}
                onDoubleClickCapture={(event) => {
                    if (included) {
                        return
                    }
                    event.stopPropagation()
                    const selection = path
                    dispatch(selectComponent({ selection }))
                }}
            >
                <div style={{ cursor: 'grab', position: 'absolute', top: -20 }}>
                    <Text
                        ref={drag}
                        truncate
                        size={1}
                        textColor="rgb(132,132,132)"
                    >
                        {state}
                    </Text>
                </div>
                {/* <Mould {...mould} currentState={state}></Mould> */}
                {paused ? (
                    <Mould {...mould} currentState={state}></Mould>
                ) : (
                    <RuntimeMould
                        __mouldId={mould.id}
                        {...inputValue}
                    ></RuntimeMould>
                )}
            </Box>
        </>
    )
    // </ResizableBox>
}
