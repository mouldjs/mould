import React, { useState, useRef, useMemo } from 'react'
import { View as ViewType, EditorState, Vector, Path, Component } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import dynamic from 'next/dynamic'
import { Play, Pause } from 'react-feather'
import {
    useIsSelectedMould,
    useIsSelectedState,
    useIsIncludePath,
    useIsSelectedPath,
    rootTree,
} from './utils'
import { ResizableBox } from 'react-resizable'
import { resizeView, dragView, dragToView } from './appShell'
import { Box, Text, Input } from '@modulz/radix'
import Mould from './Mould'
import { useDrag, useDrop } from 'react-dnd'
import DebugPanel from './DebugPanel'
import { TitledBoard, Cell } from '../inspector/FormComponents'
import { runtime } from '../runtime'
import { tick } from './selectionTick'

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
    const mould = moulds[mouldId]
    const [, drag] = useDrag({
        item: {
            type: 'TREE',
            name: 'Mould',
            props: { __mouldId: mouldId, __state: state },
            // children: mould.states[state],
        },
    })
    const [{ isOver, canDrop }, drop] = useDrop<
        { type: string; name: string; props?: object; children?: Component[] },
        { res: boolean },
        { isOver: boolean; canDrop: boolean }
    >({
        accept: 'TREE',
        drop: (item, monitor) => {
            if (monitor.getDropResult() && monitor.getDropResult().res) {
                return { res: true }
            }

            if (!selected) {
                return
            }

            dispatch(
                dragToView({
                    viewId,
                    tree: {
                        type: item.name,
                        props: item.props || {},
                        children: item.children,
                    },
                })
            )

            return { res: true }
        },
        collect: (monitor) => {
            let canDrop = false
            try {
                canDrop = monitor.canDrop()
            } catch (e) {}

            return {
                isOver: monitor.isOver(),
                canDrop,
            }
        },
    })
    const path: Path = [[mouldId, state], []]
    const included = useIsIncludePath(path)
    const selected = useIsSelectedPath(path)
    const viewRef = useRef()
    const [paused, setPaused] = useState(true)
    const [inputValue, setInputValue] = useState({})
    const RuntimeMould = useMemo(() => runtime(moulds), [moulds])

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
                            renderTitle={() => {
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
                ref={(dom) => {
                    drop(dom)
                    viewRef.current = dom
                }}
                boxShadow="0px 0px 5px #aaaaaa"
                position="absolute"
                // width={width}
                // height={height}
                // bg="white"
                // left={x}
                // top={y}
                style={{
                    width,
                    height,
                    left: x,
                    top: y,
                    background: 'transparent',
                }}
                onDoubleClickCapture={() => {
                    if (!mould.states[state]) {
                        tick((tickData = []) => {
                            tickData.push(path)

                            return tickData
                        })
                    }
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
