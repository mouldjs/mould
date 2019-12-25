import React, { Fragment, useState } from 'react'
import {
    ViewGroup as ViewGroupType,
    EditorState,
    Mould as MouldType,
    View,
} from './types'
import {
    Box,
    Text,
    Badge,
    Flex,
    Select,
    Dialog,
    GhostButton,
    Input,
    Button,
} from '@modulz/radix'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectComponent,
    addInput,
    removeInput,
    addScope,
    removeScope,
    addState,
    removeState,
    resizeView,
    modifyInputDescription,
} from './appShell'
import { useIsSelectedMould } from './utils'
import { MouldInspector } from './Inspectors'
import { TitledBoard, Cell } from '../inspector/FormComponents'
import { Settings, Trash2, X } from 'react-feather'
import Mould from './Mould'
import { Resizable, ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

const InputEditor = ({ input, id }: MouldType) => {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('')
    const dispatch = useDispatch()

    return (
        <Fragment>
            <Dialog
                isOpen={isOpen}
                onDismiss={() => {
                    setIsOpen(false)
                }}
            >
                <Box p={6}>
                    {Object.keys(input).map(k => {
                        const v = input[k]

                        return (
                            <Flex>
                                <Text>{k}</Text>
                                <Input
                                    value={input[k]}
                                    onChange={e => {
                                        dispatch(
                                            modifyInputDescription({
                                                mouldId: id,
                                                inputKey: k,
                                                description: e.target.value,
                                            })
                                        )
                                    }}
                                    ml={2}
                                ></Input>
                                <GhostButton
                                    onClick={() => {
                                        dispatch(
                                            removeInput({
                                                mouldId: id,
                                                inputKey: k,
                                            })
                                        )
                                    }}
                                >
                                    <Trash2></Trash2>
                                </GhostButton>
                            </Flex>
                        )
                    })}
                    <Box p={1}>
                        <Input
                            value={value}
                            onChange={e => {
                                setValue(e.target.value)
                            }}
                        ></Input>
                        <Button
                            onClick={() => {
                                dispatch(
                                    addInput({ mouldId: id, inputKey: value })
                                )
                                setValue('')
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Dialog>
            <TitledBoard
                title="Inputs"
                renderTitle={() => {
                    return (
                        <Settings
                            onClick={() => setIsOpen(true)}
                            size={14}
                        ></Settings>
                    )
                }}
            >
                <Box marginY={1}>
                    {Object.keys(input).map(k => {
                        return (
                            <Cell key={k} label={k}>
                                {
                                    <Input
                                        value={input[k]}
                                        onChange={e => {
                                            dispatch(
                                                modifyInputDescription({
                                                    mouldId: id,
                                                    inputKey: k,
                                                    description: e.target.value,
                                                })
                                            )
                                        }}
                                        ml={2}
                                    ></Input>
                                }
                            </Cell>
                        )
                    })}
                </Box>
            </TitledBoard>
        </Fragment>
    )
}

const ScopeEditor = ({ scope, id }: MouldType) => {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('')
    const dispatch = useDispatch()

    return (
        <Fragment>
            <Dialog
                isOpen={isOpen}
                onDismiss={() => {
                    setIsOpen(false)
                }}
            >
                <Box p={6}>
                    {scope.map(s => {
                        return (
                            <Badge size={1}>
                                {s}
                                <GhostButton
                                    onClick={() => {
                                        dispatch(
                                            removeScope({
                                                mouldId: id,
                                                scope: s,
                                            })
                                        )
                                    }}
                                >
                                    <X></X>
                                </GhostButton>
                            </Badge>
                        )
                    })}
                    <Box p={1}>
                        <Input
                            value={value}
                            onChange={e => {
                                setValue(e.target.value)
                            }}
                        ></Input>
                        <Button
                            onClick={() => {
                                dispatch(
                                    addScope({ mouldId: id, scope: value })
                                )
                                setValue('')
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Dialog>
            <TitledBoard
                title="Scopes"
                renderTitle={() => {
                    return (
                        <Settings
                            onClick={() => setIsOpen(true)}
                            size={14}
                        ></Settings>
                    )
                }}
            >
                <Flex marginY={1} marginX={3}>
                    {scope.map(s => {
                        return <Badge size={1}>{s}</Badge>
                    })}
                </Flex>
            </TitledBoard>
        </Fragment>
    )
}

const StateEditor = ({ states, id }: MouldType) => {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('')
    const dispatch = useDispatch()

    return (
        <Fragment>
            <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
                <Box p={6}>
                    {Object.keys(states).map(s => {
                        return (
                            <Badge size={1}>
                                {s}
                                <GhostButton
                                    onClick={() => {
                                        dispatch(
                                            removeState({
                                                mouldId: id,
                                                state: s,
                                            })
                                        )
                                    }}
                                >
                                    <X></X>
                                </GhostButton>
                            </Badge>
                        )
                    })}
                    <Box p={1}>
                        <Input
                            value={value}
                            onChange={e => {
                                setValue(e.target.value)
                            }}
                        ></Input>
                        <Button
                            onClick={() => {
                                dispatch(
                                    addState({ mouldId: id, state: value })
                                )
                                setValue('')
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            <TitledBoard
                title="States"
                renderTitle={() => {
                    return (
                        <Settings
                            onClick={() => setIsOpen(true)}
                            size={14}
                        ></Settings>
                    )
                }}
            >
                {Object.keys(states).map(s => {
                    return <Badge size={1}>{s}</Badge>
                })}
            </TitledBoard>
        </Fragment>
    )
}

const MOULDS_PADDING = 50

export const ViewGroup = ({ id }: { id: string }) => {
    const { x, y, views, mouldId } = useSelector(
        (state: EditorState) => state.viewGroups[id]
    )
    const viewsInHere = useSelector((state: EditorState): {
        [key: string]: View
    } =>
        Object.keys(views).reduce((prev, curr) => {
            prev[curr] = state.views[views[curr]]

            return prev
        }, {})
    )
    const mould = useSelector((state: EditorState) => state.moulds[mouldId])
    const dispatch = useDispatch()
    const isSelected = useIsSelectedMould(mouldId)
    const states = Object.keys(mould.states)

    return (
        <Fragment>
            <Flex
                position="absolute"
                left={x}
                top={y}
                width={
                    Object.values(viewsInHere).reduce(
                        (prev, curr) => prev + curr.width,
                        0
                    ) +
                    (states.length + 1) * MOULDS_PADDING
                }
                height={
                    Object.values(viewsInHere).reduce(
                        (prev, curr) => Math.max(prev, curr.height),
                        0
                    ) +
                    MOULDS_PADDING * 2
                }
                p={MOULDS_PADDING}
                boxSizing="border-box"
                borderRadius={10}
                bg="#f1f1f1"
                border={isSelected ? `1px solid #56a9f1` : 'none'}
                onDoubleClick={e => {
                    e.stopPropagation()
                    dispatch(
                        selectComponent({
                            selection: mouldId,
                        })
                    )
                }}
            >
                <Box position="absolute" top={-20} left={0}>
                    <Text truncate size={1} textColor="rgb(132,132,132)">
                        {mould.name}
                    </Text>
                </Box>
                {states
                    .map((state, i) => {
                        const view = viewsInHere[state]

                        return (
                            <ResizableBox
                                // key={view.id}
                                width={view.width}
                                height={view.height}
                                onResize={(e, { size: { width, height } }) => {
                                    dispatch(
                                        resizeView({
                                            viewId: view.id,
                                            width,
                                            height,
                                        })
                                    )
                                }}
                            >
                                <Box
                                    boxShadow="0px 0px 5px #aaaaaa"
                                    position="relative"
                                    width="100%"
                                    height="100%"
                                    bg="white"
                                >
                                    <Box position="absolute" top={-20}>
                                        <Text
                                            truncate
                                            size={1}
                                            textColor="rgb(132,132,132)"
                                        >
                                            {state}
                                        </Text>
                                    </Box>
                                    <Mould
                                        editable
                                        {...mould}
                                        currentState={state}
                                    ></Mould>
                                </Box>
                            </ResizableBox>
                        )
                    })
                    .reduce((prev, curr, index) => {
                        if (index === 0) {
                            return [curr]
                        }
                        return [
                            ...prev,
                            <div style={{ width: MOULDS_PADDING }}></div>,
                            curr,
                        ]
                    }, [])}
            </Flex>
            <MouldInspector mouldId={mouldId}>
                <InputEditor {...mould}></InputEditor>
                <ScopeEditor {...mould}></ScopeEditor>
                <StateEditor {...mould}></StateEditor>
            </MouldInspector>
        </Fragment>
    )
}
