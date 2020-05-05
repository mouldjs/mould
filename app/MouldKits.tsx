import React, { useState } from 'react'
import Components from '../components'
import { Flex, Text, Box, Select, Option, Checkbox } from '@modulz/radix'
import { ArcherElement } from 'react-archer'
import { Type } from 'react-feather'
import { useCurrentMould } from './utils'
import { useDrop, useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { addKit, connectScopeToKit, modifyKit } from './appShell'
import { Kit, EditorState } from './types'

const MouldKitItem = ({
    type,
    name,
    param,
    isList,
    dataMappingVector,
    onConnect,
    onIsListChange,
}: Kit & {
    onConnect: (prop: string, scope: string) => void
    onIsListChange: (checked: boolean) => void
}) => {
    const moulds = useSelector((state: EditorState) => state.moulds)
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
    const Icon = plugin.icon

    const fields =
        plugin.type === 'Mould'
            ? Object.keys(moulds[(param as any).mouldId].input)
            : Object.keys(plugin.propType._def.shape)

    return (
        <Flex
            height={70}
            justifyContent="space-between"
            padding="8px 0 8px 8px"
            ref={(dom) => {
                drop(dom)
                drag(dom)
            }}
        >
            <Flex flexDirection="column">
                <Flex>
                    <Flex
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Flex justifyContent="center" alignItems="center">
                            <Icon></Icon>
                        </Flex>
                    </Flex>
                    <Text>{name}</Text>
                </Flex>
                <Flex>
                    <Checkbox
                        bg="white"
                        checked={isList}
                        onChange={(e) => onIsListChange(e.target.checked)}
                    ></Checkbox>
                    is list
                </Flex>
            </Flex>
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
