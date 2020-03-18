import React, { useState } from 'react'
import Components from '../components'
import { Flex, Text, Box, Select, Option } from '@modulz/radix'
import { ArcherElement } from 'react-archer'
import { Type } from 'react-feather'
import { useCurrentMould } from './utils'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { addKit, connectScopeToKit } from './appShell'
import { Kit } from './types'

const MouldKitItem = ({
    type,
    name,
    dataMappingVector,
    onConnect,
}: Kit & { onConnect: (prop: string, scope: string) => void }) => {
    const [draggingScope, setDraggingScope] = useState<string>('')
    const [, drop] = useDrop<{ type: 'SCOPE'; scope: string }, void, void>({
        accept: 'SCOPE',
        drop: item => {
            setDraggingScope(item.scope)
        },
    })
    const plugin = Components.find(c => c.type === type)
    if (!plugin) {
        return null
    }
    const Icon = plugin.icon

    return (
        <Flex
            height={70}
            justifyContent="space-between"
            padding="8px 0 8px 8px"
            ref={drop}
        >
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
            <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-end"
            >
                {dataMappingVector.map(([source, target]) => {
                    return (
                        <ArcherElement
                            id={`prop-${source}`}
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
                        onValueChange={value => {
                            if (value) {
                                onConnect(value, draggingScope)
                            }
                            setDraggingScope('')
                        }}
                    >
                        <Option value="" label="select"></Option>
                        {Object.keys(plugin.propType._def.shape).map(k => {
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
        drop: item => {
            dispatch(addKit({ mouldId: mould!.id, type: item.name }))
        },
    })

    if (!mould) {
        return null
    }

    return (
        <Box ref={drop}>
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
                        ></MouldKitItem>
                    )
                })
            ) : (
                <Box height={300}>Drag kits here</Box>
            )}
        </Box>
    )
}
