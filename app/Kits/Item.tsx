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
import {
    modifyKitName,
    deleteKit,
    disconnectScopeToKit,
    updateDraggingStatus,
} from '../appShell'
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
    mouldName,
}: Kit & {
    onConnect: (prop: string, scope: string) => void
    onIsListChange: (checked: boolean) => void
    mouldName: string
}) => {
    const moulds = useSelector((state: EditorState) => state.moulds)
    const dispatch = useDispatch()
    const stateName = useCurrentState()
    const { kits } = moulds.find((m) => m.name === mouldName)!
    const kitNames = kits.map((k) => (k.name === name ? '' : k.name))
    const ready = isList !== undefined
    const [draggingScope, setDraggingScope] = useState<string>('')
    const [inputValue, setInputValue] = useState(name)

    const [errorTip, setErrorTip] = useState('')
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
                                  ? {
                                        __mouldName: (param as any).mouldName,
                                        __state: (param as any).mouldState,
                                    }
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
        begin: () => {
            dispatch(updateDraggingStatus({ isDragging: true }))
        },
        end: () => {
            dispatch(updateDraggingStatus({ isDragging: false }))
        },
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
    const Icon = plugin.Icon

    const fields =
        plugin.type === 'Mould'
            ? Object.keys(
                  moulds.find((m) => m.name === (param as any).mouldName)!.input
              )
            : Object.keys(plugin.Standard!._def.shape)

    const doDelete = ({
        kitName,
        mouldName,
        stateName,
    }: {
        kitName: string
        mouldName: string
        stateName: string
    }) => {
        dispatch(
            deleteKit({
                mouldName: mouldName,
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
            <div
                style={{
                    justifyContent: 'space-between',
                    padding: 10,
                    paddingLeft: 20,
                    display: 'flex',
                }}
                ref={(dom) => {
                    ready && drop(dom)
                    ready && drag(dom)
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Icon></Icon>
                    <div
                        style={{
                            width: '100%',
                            marginLeft: 5,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
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
                                                mouldName: mouldName,
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
                                        mouldName,
                                        stateName,
                                        kitName: name,
                                    })
                                }
                            >
                                <X color="#333" size={13}></X>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}
                >
                    {dataMappingVector.map(([source, target], index) => {
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
                                <Hover style={{ position: 'relative' }}>
                                    {(isHovered) => (
                                        <>
                                            <X
                                                color="#333"
                                                size={10}
                                                onClick={() => {
                                                    dispatch(
                                                        disconnectScopeToKit({
                                                            scope: target,
                                                            prop: source,
                                                            mouldName,
                                                            kitName: name,
                                                        })
                                                    )
                                                }}
                                                className="clickable"
                                                style={{
                                                    position: 'absolute',
                                                    display: isHovered
                                                        ? 'block'
                                                        : 'none',
                                                    left: '-10px',
                                                    top: '3px',
                                                }}
                                            ></X>
                                            <Text size={0}>{source}</Text>
                                        </>
                                    )}
                                </Hover>
                            </ArcherElement>
                        )
                    })}
                    {draggingScope && (
                        <>
                            <Popover
                                key="Popover"
                                interactionKind={PopoverInteractionKind.HOVER}
                            >
                                <Flex translate alignItems="center">
                                    Select
                                    <ChevronDown
                                        color="#333"
                                        size={13}
                                    ></ChevronDown>
                                </Flex>
                                <Grid
                                    translate
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
                </div>
            </div>
        </Card>
    )
}

export default MouldKitItem
