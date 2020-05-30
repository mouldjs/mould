import React, { useState, useRef, useMemo, useEffect } from 'react'
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
import {
    resizeView,
    dragView,
    dragToView,
    modifyInput,
    removeInput,
    selectComponent,
} from './appShell'
import { Box, Text, Input } from '@modulz/radix'
import EditingMould from './EditingMould'
import { ViewContext } from './Contexts'
import { useDrag, useDrop } from 'react-dnd'
import DebugPanel from './DebugPanel'
import {
    TitledBoard,
    Cell,
    ControlGrid,
    ControlGridItem,
} from '../inspector/FormComponents'
import { runtime } from '../runtime'
import { tick } from './selectionTick'
import Controls from '../controls'
import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core'
import { MouldInput } from './MouldInput'
import { without } from 'lodash'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
})

const ViewContextProvider = ViewContext.Provider

export const View = ({ viewId }: { viewId: string }) => {
    const dispatch = useDispatch()
    const { views, testWorkspace } = useSelector((state: EditorState) => state)
    const view = views[viewId]
    const { mouldId, state, x, y, width, height } = view
    const { moulds } = useSelector((state: EditorState) => state)
    const mould = moulds[mouldId]
    const selectView = ({ mouldId, stateName }) => {
        const path: Path = [[mouldId, stateName], []]
        const pathData: any = [path]
        dispatch(
            selectComponent({
                pathes: pathData,
            })
        )
    }

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
                selectView({ mouldId, stateName: state })
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
    const selected = useIsSelectedPath(path)
    const viewRef = useRef()
    const [paused, setPaused] = useState(true)
    const [inputValue, setInputValue] = useState({})
    const [editControlName, setEditControlName] = useState<string | null>(null)
    const RuntimeMould = useMemo(() => runtime(moulds), [moulds])

    const otherViews = without(testWorkspace.views, viewId)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setReady(true)
    }, [viewRef.current])

    return (
        <>
            {selected && ready && (
                <>
                    <Moveable
                        key={JSON.stringify({ x, y, width, height })}
                        target={viewRef.current}
                        resizable
                        draggable
                        snappable
                        snapCenter
                        isDisplaySnapDigit={false}
                        origin={false}
                        throttleResize={0}
                        edge
                        onResize={({
                            target,
                            width,
                            height,
                            dist: [mx, my],
                            direction: [dx, dy],
                        }) => {
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
                        elementGuidelines={otherViews.map((v) =>
                            document.getElementById(`view-${v}`)
                        )}
                    ></Moveable>
                    <DebugPanel.Source>
                        <div
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
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
                                {Object.keys(mould.input).map(
                                    (input, index) => {
                                        const isFirst = index === 0
                                        const config = mould.input[input]
                                        const Control =
                                            Controls[config.type].Renderer

                                        return (
                                            <div
                                                onContextMenu={(event) => {
                                                    event.preventDefault()
                                                    ContextMenu.show(
                                                        <Menu>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    setEditControlName(
                                                                        input
                                                                    )
                                                                }}
                                                                icon="edit"
                                                                text="Edit"
                                                            ></MenuItem>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    dispatch(
                                                                        removeInput(
                                                                            {
                                                                                mouldId,
                                                                                inputKey: input,
                                                                            }
                                                                        )
                                                                    )
                                                                }}
                                                                icon="remove"
                                                                text="Remove"
                                                            ></MenuItem>
                                                        </Menu>,
                                                        {
                                                            left: event.clientX,
                                                            top: event.clientY,
                                                        }
                                                    )
                                                }}
                                            >
                                                <ControlGrid
                                                    marginTop={isFirst ? 0 : 8}
                                                >
                                                    <ControlGridItem area="active / active / visual / visual">
                                                        {input}
                                                    </ControlGridItem>
                                                    <ControlGridItem area="value / value / control / control">
                                                        <Control
                                                            config={config}
                                                            data={
                                                                inputValue[
                                                                    input
                                                                ]
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                setInputValue({
                                                                    ...inputValue,
                                                                    [input]: value,
                                                                })
                                                            }}
                                                        ></Control>
                                                    </ControlGridItem>
                                                </ControlGrid>
                                            </div>
                                        )
                                    }
                                )}
                            </TitledBoard>
                        </div>
                    </DebugPanel.Source>
                </>
            )}
            {editControlName && (
                <MouldInput
                    isOpen={!!(editControlName as any)}
                    onClose={() => {
                        setEditControlName(null)
                    }}
                    name={editControlName}
                    onSubmit={(name, config) => {
                        if (name !== editControlName) {
                            dispatch(
                                removeInput({
                                    inputKey: editControlName,
                                    mouldId,
                                })
                            )
                        }
                        dispatch(
                            modifyInput({
                                inputKey: name,
                                config,
                                mouldId,
                            })
                        )
                    }}
                ></MouldInput>
            )}
            <ViewContextProvider value={view}>
                <div
                    id={`view-${viewId}`}
                    ref={(dom) => {
                        drop(dom)
                        viewRef.current = dom as any
                    }}
                    style={{
                        position: 'absolute',
                        width,
                        height,
                        left: x,
                        top: y,
                        background: 'transparent',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: isOver && canDrop ? '#4af' : '#aaa',
                        boxShadow:
                            isOver && canDrop
                                ? '0px 0px 5px #4af'
                                : '0px 0px 5px #aaa',
                    }}
                    onDoubleClick={() => {
                        if (!mould.states[state]) {
                            tick((tickData = []) => {
                                tickData.unshift(path)

                                return tickData
                            })
                        }
                    }}
                >
                    <div
                        style={{
                            cursor: 'grab',
                            position: 'absolute',
                            top: -25,
                        }}
                    >
                        <Text
                            ref={drag}
                            truncate
                            size={1}
                            textColor="rgb(132,132,132)"
                        >
                            {state}
                        </Text>
                    </div>
                    {paused ? (
                        <EditingMould
                            {...mould}
                            currentState={state}
                        ></EditingMould>
                    ) : (
                        <RuntimeMould
                            __mouldId={mould.id}
                            {...inputValue}
                        ></RuntimeMould>
                    )}
                </div>
            </ViewContextProvider>
        </>
    )
    // </ResizableBox>
}
