import React, { useState } from 'react'
import Components from '../../components'
import { Flex, Text, Select, Option, Card } from '@modulz/radix'
import { X } from 'react-feather'
import { EditableText } from '@blueprintjs/core'
import { ArcherElement } from 'react-archer'
import { useCurrentState, useCurrentMould } from '../utils'
import { useDrop, useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { modifyKitName, deleteKit } from '../appShell'
import { Kit, EditorState } from '../types'

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
    const { kits } = moulds[mouldId]
    const kitNames = kits.map((k) => (k.name === name ? '' : k.name))
    const ready = isList !== undefined
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
    const [inputValue, setInputValue] = useState(name)

    const [errorTip, setErrorTip] = useState('')

    const doDelete = ({
        kitName,
        mouldId,
        stateName,
    }: {
        kitName: string
        mouldId: string
        stateName: string
    }) => {
        dispatch(
            deleteKit({
                mouldId: mouldId,
                kitName: kitName,
                stateName,
            })
        )
    }

    return (
        <Card p={0} mb={5} sx={{ position: 'relative' }}>
            <Flex
                justifyContent="space-between"
                p={10}
                pl={20}
                ref={(dom) => {
                    ready && drop(dom)
                    ready && drag(dom)
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
                        <div
                            style={{
                                position: 'relative',
                                maxWidth: '80px',
                                marginBottom: '15px',
                                fontSize: '14px',
                            }}
                        >
                            <EditableText
                                type="text"
                                value={inputValue}
                                placeholder="Name this Kit"
                                onConfirm={() => {
                                    if (!inputValue) {
                                        setErrorTip('Cant Empty')
                                        setInputValue(name)
                                        return
                                    }
                                    if (kitNames.includes(inputValue)) {
                                        setErrorTip('Duplicated')
                                        setInputValue(name)
                                        return
                                    }
                                    setErrorTip('')
                                    stateName &&
                                        dispatch(
                                            modifyKitName({
                                                newKitName: inputValue,
                                                kitName: name,
                                                mouldId: mouldId,
                                                stateName,
                                            })
                                        )
                                }}
                                onChange={(value) => {
                                    setInputValue(value)
                                }}
                                onEdit={() => {
                                    setInputValue(name)
                                }}
                                confirmOnEnterKey={true}
                                selectAllOnFocus={true}
                            ></EditableText>
                            {errorTip && (
                                <p
                                    className="warn"
                                    style={{
                                        position: 'absolute',
                                        top: '18px',
                                        left: '-4px',
                                        fontSize: '12px',
                                        transform: 'scale(.9)',
                                    }}
                                >
                                    {errorTip}
                                </p>
                            )}
                        </div>
                        {isList === undefined ? (
                            <>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <label htmlFor={`checkbox${name}`}>
                                        <Text size={2}>Is a list ?</Text>
                                    </label>
                                    <button
                                        className="bp3-button m-l-sm"
                                        type="button"
                                        onClick={() => onIsListChange(true)}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bp3-button m-l-sm"
                                        type="button"
                                        onClick={() => onIsListChange(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Text
                                as="p"
                                mt={10}
                                sx={{
                                    color: '#aaa',
                                    fontStyle: 'italic',
                                    marginTop: 0,
                                }}
                            >
                                - {isList ? 'isList' : 'isSingle'}
                            </Text>
                        )}
                        {ready && (
                            <div
                                className="clickable"
                                style={{
                                    position: 'absolute',
                                    left: '3px',
                                    top: '3px',
                                }}
                                onClick={() =>
                                    stateName &&
                                    doDelete({
                                        mouldId,
                                        stateName,
                                        kitName: name,
                                    })
                                }
                            >
                                <X color="#333" size={13}></X>
                            </div>
                        )}
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
        </Card>
    )
}

export default MouldKitItem
