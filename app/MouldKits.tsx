import React, { useState } from 'react'
import Components from '../components'
import {
    Flex,
    Text,
    Box,
    Select,
    Option,
    Checkbox,
    Input,
    Card,
} from '@modulz/radix'
import { ArcherElement } from 'react-archer'
import { useCurrentMould, useCurrentState } from './utils'
import { useDrop, useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { addKit, connectScopeToKit, modifyKit, modifyKitName } from './appShell'
import { Kit, EditorState } from './types'

const MouldKitItem = ({
    type,
    name,
    param,
    isList,
    dataMappingVector,
    onConnect,
    onIsListChange,
    mouldId,
}: Kit & {
    onConnect: (prop: string, scope: string) => void
    onIsListChange: (checked: boolean) => void
    mouldId: string
}) => {
    const moulds = useSelector((state: EditorState) => state.moulds)
    const dispatch = useDispatch()
    const stateName = useCurrentState()
    const [draggingScope, setDraggingScope] = useState<string>('')
    const [, drop] = useDrop<{ type: 'SCOPE'; scope: string }, void, void>({
        accept: 'SCOPE',
        drop: (item) => {
            setDraggingScope(item.scope)
        },
    })
    const [, drag] = useDrag({
        item: isList
            ? {
                  type: 'TREE',
                  name: 'Kit',
                  props: { __kitName: name },
                  children: [
                      {
                          type,
                          props:
                              type === 'Mould'
                                  ? { __mouldId: (param as any).mouldId }
                                  : {},
                      },
                  ],
              }
            : {
                  type: 'TREE',
                  name: 'Kit',
                  props: { __kitName: name },
              },
    })
    const plugin = Components.find((c) => c.type === type)
    if (!plugin) {
        return null
    }
    if (plugin.type === 'Kit') {
        return null
    }
    const Icon = plugin.icon

    const fields =
        plugin.type === 'Mould'
            ? moulds[(param as any).mouldId].input
            : Object.keys(plugin.propType._def.shape)

    const [editing, setEditing] = useState(false)

    return (
        <Card p={0} mb={5}>
            <Flex
                justifyContent="space-between"
                pl={10}
                pt={5}
                pb={5}
                ref={(dom) => {
                    drop(dom)
                    drag(dom)
                }}
            >
                <Flex alignItems="center" width="100%">
                    <Icon></Icon>
                    <Flex
                        width="100%"
                        ml="5px"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        {editing ? (
                            <Input
                                value={name}
                                placeholder="Input your content"
                                variant="fade"
                                onChange={(e) => {
                                    stateName &&
                                        dispatch(
                                            modifyKitName({
                                                newKitName: e.target.value,
                                                kitName: name,
                                                mouldId: mouldId,
                                                stateName,
                                            })
                                        )
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.target.blur()
                                    }
                                }}
                            ></Input>
                        ) : (
                            <Text
                                size={3}
                                onClick={() => {
                                    setEditing(true)
                                }}
                            >
                                {name}
                            </Text>
                        )}
                        <Flex width="100%" alignItems="center">
                            <label htmlFor={`checkbox${name}`}>
                                <Text size={2}>Is a list ?</Text>
                            </label>
                            <Checkbox
                                id={`checkbox${name}`}
                                bg="white"
                                checked={isList}
                                onChange={(e) =>
                                    onIsListChange(e.target.checked)
                                }
                                ml="5px"
                            ></Checkbox>
                        </Flex>
                    </Flex>
                </Flex>

                {/* scope connection */}
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    {dataMappingVector.map(([source, target]) => {
                        return (
                            <ArcherElement
                                key={`prop-${source}-${name}`}
                                id={`prop-${source}-${name}`}
                                relations={[
                                    {
                                        targetId: `scope-${target}`,
                                        targetAnchor: 'left',
                                        sourceAnchor: 'right',
                                    },
                                ]}
                            >
                                <div>
                                    <Text size={0}>{source}</Text>
                                </div>
                            </ArcherElement>
                        )
                    })}
                    {draggingScope && (
                        <Select
                            size={0}
                            value=""
                            variant="ghost"
                            onValueChange={(value) => {
                                if (value) {
                                    onConnect(value, draggingScope)
                                }
                                setDraggingScope('')
                            }}
                        >
                            <Option value="" label="select"></Option>
                            {fields.map((k) => {
                                return <Option value={k} label={k}></Option>
                            })}
                        </Select>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}

export const MouldKits = () => {
    const dispatch = useDispatch()
    const mould = useCurrentMould()
    const [{ isOver, canDrop }, drop] = useDrop<
        { type: string; name: string; props?: object },
        void,
        { isOver: boolean; canDrop: boolean }
    >({
        accept: 'TREE',
        drop: (item) => {
            dispatch(
                addKit({
                    mouldId: mould!.id,
                    type: item.name,
                    param:
                        item.name === 'Mould'
                            ? { mouldId: (item.props as any).__mouldId }
                            : undefined,
                })
            )
        },
    })

    if (!mould) {
        return null
    }

    return (
        <Box minHeight={300} ref={drop}>
            {mould.kits.length ? (
                mould.kits.map((kit, i) => {
                    return (
                        <MouldKitItem
                            {...kit}
                            mouldId={mould.id}
                            onConnect={(prop, scope) => {
                                dispatch(
                                    connectScopeToKit({
                                        mouldId: mould.id,
                                        kitIndex: i,
                                        prop,
                                        scope,
                                    })
                                )
                            }}
                            onIsListChange={(checked) => {
                                dispatch(
                                    modifyKit({
                                        mouldId: mould.id,
                                        kitName: kit.name,
                                        isList: checked,
                                    })
                                )
                            }}
                        ></MouldKitItem>
                    )
                })
            ) : (
                <Box>Drag kits here</Box>
            )}
        </Box>
    )
}
