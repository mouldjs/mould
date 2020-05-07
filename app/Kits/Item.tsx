import React, { useState, useEffect } from 'react'
import Components from '../../components'
import { Flex, Text, Card, Grid, Hover } from '@modulz/radix'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { X, ChevronDown } from 'react-feather'
import { EditableText } from '@blueprintjs/core'
import { ArcherElement } from 'react-archer'
import { useCurrentState } from '../utils'
import { useDrop, useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { modifyKitName, deleteKit } from '../appShell'
import { Kit, EditorState } from '../types'
import { getEmptyImage } from 'react-dnd-html5-backend'

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

    const [{ isDragging }, drag, preview] = useDrag({
        item: isList
            ? {
                  type: 'TREE',
                  name: 'Kit',
                  props: { __kitName: name },
                  layerData: {
                      name,
                      isList,
                      type,
                  },
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
                  layerData: {
                      name,
                      isList,
                      type,
                  },
              },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

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
            ? Object.keys(moulds[(param as any).mouldId].input)
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

    const usedAttrs = dataMappingVector.map(([src]) => src)
    const attrsList = fields.filter((f) => !usedAttrs.includes(f))
    return (
        <Card
            p={0}
            mb={5}
            sx={{
                position: 'relative',
                opacity: isDragging ? '.5' : '1',
                border: '1px solid #ccc',
            }}
        >
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
                        <>
                            <Popover
                                key="Popover"
                                interactionKind={PopoverInteractionKind.HOVER}
                            >
                                <Flex alignItems="center">
                                    Select
                                    <ChevronDown
                                        color="#333"
                                        size={13}
                                    ></ChevronDown>
                                </Flex>
                                <Grid
                                    p={10}
                                    sx={{
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 1,
                                    }}
                                >
                                    {attrsList.map((k) => {
                                        return (
                                            <>
                                                <Hover>
                                                    {(isHovered) => (
                                                        <p
                                                            className="clickable"
                                                            style={{
                                                                padding: '5px',
                                                                border:
                                                                    '1px solid',
                                                                borderColor: isHovered
                                                                    ? '#56a9f1'
                                                                    : '#ddd',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                            onClick={(e) => {
                                                                onConnect(
                                                                    k,
                                                                    draggingScope
                                                                )
                                                                setDraggingScope(
                                                                    ''
                                                                )
                                                            }}
                                                        >
                                                            {k}
                                                        </p>
                                                    )}
                                                </Hover>
                                            </>
                                        )
                                    })}
                                </Grid>
                            </Popover>
                        </>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}

export default MouldKitItem
