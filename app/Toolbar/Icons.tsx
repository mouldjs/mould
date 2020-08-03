import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EditorState } from '../types'
import { Text } from '@modulz/radix'
import { waitingForCreating, updateDraggingStatus } from '../appShell'
import { Popover } from '@blueprintjs/core'
import { Layers, Move, Type, Edit, Star } from 'react-feather'
import { useDrag } from 'react-dnd'
import { useCurrentMould } from '../utils'
import { delay } from 'lodash'
import MouldApp from '../../mould'

const getIcon = (name) => {
    const baseComponents = {
        Text: {
            descInPopover: (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Move size={32} color="#666"></Move>
                    </div>
                    <Text
                        as="p"
                        mt={15}
                        sx={{ color: '#666', textAlign: 'center' }}
                    >
                        Create a {name}
                    </Text>
                    <Text
                        size={2}
                        as="p"
                        mt={10}
                        sx={{ color: '#666', lineHeight: '1.3' }}
                    >
                        Grabbing to kits or your working view directly.
                    </Text>
                </>
            ),
        },
        Input: {
            descInPopover: (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Move size={32} color="#666"></Move>
                    </div>
                    <Text
                        as="p"
                        mt={15}
                        sx={{ color: '#666', textAlign: 'center' }}
                    >
                        Create a {name}
                    </Text>
                    <Text
                        size={2}
                        as="p"
                        mt={10}
                        sx={{ color: '#666', lineHeight: '1.3' }}
                    >
                        Grabbing to kits or your working view directly.
                    </Text>
                </>
            ),
        },
        Stack: {
            descInPopover: (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Move size={32} color="#666"></Move>
                    </div>
                    <Text
                        as="p"
                        mt={15}
                        sx={{ color: '#666', textAlign: 'center' }}
                    >
                        Create a {name}
                    </Text>
                    <Text
                        size={2}
                        as="p"
                        mt={10}
                        sx={{ color: '#666', lineHeight: '1.3' }}
                    >
                        Grabbing to kits or your working view directly. Or click
                        and drag a new state with having a {name} in workspace
                        below.
                    </Text>
                </>
            ),
        },
        Frame: {
            descInPopover: (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Move size={32} color="#666"></Move>
                    </div>
                    <Text
                        as="p"
                        mt={15}
                        sx={{ color: '#666', textAlign: 'center' }}
                    >
                        Create a {name}
                    </Text>
                    <Text
                        size={2}
                        as="p"
                        mt={10}
                        sx={{ color: '#666', lineHeight: '1.3' }}
                    >
                        Grabbing to kits or your working view directly. Or click
                        and drag a new state with having a {name} in workspace
                        below.
                    </Text>
                </>
            ),
        },
        Icon: {
            descInPopover: (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Move size={32} color="#666"></Move>
                    </div>
                    <Text
                        as="p"
                        mt={15}
                        sx={{ color: '#666', textAlign: 'center' }}
                    >
                        Create a {name}
                    </Text>
                    <Text
                        size={2}
                        as="p"
                        mt={10}
                        sx={{ color: '#666', lineHeight: '1.3' }}
                    >
                        Grabbing to kits or your working view directly. Or click
                        and drag a new state with having a {name} in workspace
                        below.
                    </Text>
                </>
            ),
        },
    }
    return baseComponents[name]
}

const Icon = ({ iconComp, name, onHover, onPopoverOpened, isOpen }) => {
    const dispatch = useDispatch()
    const creating = useSelector((state: EditorState) => state.creating)
    const currentMould = useCurrentMould()
    const [, drag] = useDrag({
        item: { type: 'TREE', name },
        begin: () => {
            dispatch(updateDraggingStatus({ isDragging: true }))
        },
        end: () => {
            dispatch(updateDraggingStatus({ isDragging: false }))
        },
    })
    const isActive =
        creating?.injectedKitName && creating?.injectedKitName === name
    const { descInPopover } = getIcon(name) || {}

    const Icon = iconComp
    return (
        <>
            {descInPopover && (
                <Popover
                    isOpen={isOpen}
                    onOpening={() => onPopoverOpened(name)}
                >
                    <div
                        style={{
                            display: 'flex',
                            padding: '5px 10px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                        onMouseEnter={() => {
                            onHover(name)
                        }}
                        onClick={() => {
                            const waitingParams: {
                                mouldName: string
                                injectedKitName: string
                            } = {
                                mouldName: '',
                                injectedKitName: '',
                            }

                            if (currentMould) {
                                waitingParams.mouldName = currentMould.name
                            }
                            waitingParams.injectedKitName = name

                            dispatch(waitingForCreating(waitingParams))
                        }}
                        ref={drag}
                    >
                        <Icon
                            className={`${isActive ? 'primary' : 'pure'}`}
                        ></Icon>
                        <p
                            className={`clickable m-t-sm m-b-0 ${
                                isActive ? 'primary' : 'pure'
                            }`}
                        >
                            {name}
                        </p>
                    </div>
                    <div
                        style={{
                            flexDirection: 'column',
                            fontSize: '14px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 180,
                            padding: 10,
                        }}
                    >
                        {descInPopover}
                    </div>
                </Popover>
            )}
        </>
    )
}

const Icons: any = () => {
    const [opening, setOpening] = useState(null)
    let timer: number | undefined = undefined
    const onHover = (icon) => {
        setOpening(icon)
    }

    const onPopoverOpened = () => {
        if (timer) window.clearTimeout(timer)
        timer = delay(() => setOpening(null), 1500)
    }

    const baseComponentIcons = Object.keys(MouldApp.components).filter(
        (k) => MouldApp.components[k].category.name === 'Atomic'
    )

    return baseComponentIcons.map((iconName) => (
        <Icon
            iconComp={MouldApp.components[iconName].Icon}
            key={iconName}
            name={iconName}
            isOpen={iconName === opening}
            onHover={onHover}
            onPopoverOpened={onPopoverOpened}
        ></Icon>
    ))
}

export default Icons
