import React, { Fragment, useState } from 'react'
import {
    ViewGroup as ViewGroupType,
    EditorState,
    Mould as MouldType,
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
    modifyInputController,
    addScope,
    removeScope,
    addState,
    removeState,
} from './appShell'
import { useIsSelectedMould } from './utils'
import { MouldInspector } from './Inspectors'
import { TitledBoard, Cell } from '../inspector/FormComponents'
import { Plus, Settings, Trash2, X } from 'react-feather'
import Mould from './Mould'

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
                                <Select
                                    value={v}
                                    onChange={e => {
                                        dispatch(
                                            modifyInputController({
                                                mouldId: id,
                                                inputKey: k,
                                                controller: e.target.value,
                                            })
                                        )
                                    }}
                                >
                                    <option value="number">number</option>
                                    <option value="text">text</option>
                                </Select>
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
                {Object.keys(input).length === 0 && (
                    <span>There is no input yet.</span>
                )}
                {Object.keys(input).map(k => {
                    return (
                        <Cell key={k} label={k}>
                            {
                                <Select
                                    value={input[k]}
                                    onChange={e => {
                                        dispatch(
                                            modifyInputController({
                                                mouldId: id,
                                                inputKey: k,
                                                controller: e.target.value,
                                            })
                                        )
                                    }}
                                >
                                    <option value="number">number</option>
                                    <option value="text">text</option>
                                </Select>
                            }
                        </Cell>
                    )
                })}
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
                    {states.map(s => {
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
                <Select marginY={1} marginX={3}>
                    {states.map(s => {
                        return <option value={s}>{s}</option>
                    })}
                </Select>
            </TitledBoard>
        </Fragment>
    )
}

export const ViewGroup = ({ id }: { id: string }) => {
    const { x, y, name, views, active = 0, mouldId } = useSelector(
        (state: EditorState) => state.viewGroups[id]
    )
    const activeViewId = views[active]
    const activeView = useSelector(
        (state: EditorState) => state.views[activeViewId]
    )
    const mould = useSelector((state: EditorState) => state.moulds[mouldId])
    const dispatch = useDispatch()
    const isSelected = useIsSelectedMould(mouldId)

    return (
        <Fragment>
            <Flex
                position="absolute"
                left={x}
                top={y}
                width={activeView.width + 100}
                height={activeView.height + 100}
                p={50}
                // border="3px dashed palevioletred"
                boxSizing="border-box"
                borderRadius={10}
                bg="#f1f1f1"
            >
                <Box
                    boxShadow="0px 0px 5px #aaaaaa"
                    position="absolute"
                    width={activeView.width}
                    height={activeView.height}
                    bg="white"
                    style={{
                        outline: isSelected ? `1px solid #56a9f1` : 'none',
                    }}
                >
                    <Box
                        position="absolute"
                        width={activeView.width}
                        height={activeView.height}
                        top={-20}
                    >
                        <Text
                            truncate
                            size={1}
                            textColor="rgb(132,132,132)"
                            onDoubleClick={e => {
                                e.stopPropagation()
                                dispatch(
                                    selectComponent({ selection: mouldId })
                                )
                            }}
                        >
                            {name}
                        </Text>
                        <Mould editable {...mould}></Mould>
                    </Box>
                </Box>
            </Flex>
            <MouldInspector mouldId={mouldId}>
                <InputEditor {...mould}></InputEditor>
                <ScopeEditor {...mould}></ScopeEditor>
                <StateEditor {...mould}></StateEditor>
            </MouldInspector>
        </Fragment>
    )
}
