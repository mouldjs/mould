import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EditorState } from '../types'
import { Text } from '@modulz/radix'
import { waitingForCreating, updateDraggingStatus } from '../appShell'
import { Popover } from '@blueprintjs/core'
import { Layers, Move, Type, Edit, Star } from 'react-feather'
import { useDrag } from 'react-dnd'
import { useCurrentMould } from '../utils'
import { delay } from 'lodash'

const icons = ['Stack', 'Text', 'Input', 'Icon']
const getIcon = (name, isActive) => {
    const baseComponents = {
        Text: {
            icon: <Type className={`${isActive ? 'primary' : 'pure'}`}></Type>,
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
            icon: <Edit className={`${isActive ? 'primary' : 'pure'}`}></Edit>,
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
            icon: (
                <Layers className={`${isActive ? 'primary' : 'pure'}`}></Layers>
            ),
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
            icon: <Star className={`${isActive ? 'primary' : 'pure'}`}></Star>,
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

const Icon = ({ name, onHover, onPopoverOpened, isOpen }) => {
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
    const { icon, descInPopover } = getIcon(name, isActive)

    return (
        <Popover isOpen={isOpen} onOpening={() => onPopoverOpened(name)}>
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
                {icon}
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
    )
}

const Icons: any = () => {
    const [opening, setOpening] = useState(null)
    let timer = undefined
    const onHover = (icon) => {
        setOpening(icon)
    }

    const onPopoverOpened = () => {
        if (timer) window.clearTimeout(timer)
        timer = delay(() => setOpening(null), 1500)
    }

    return icons.map((icon) => (
        <Icon
            key={icon}
            name={icon}
            isOpen={icon === opening}
            onHover={onHover}
            onPopoverOpened={onPopoverOpened}
        ></Icon>
    ))
}

export default Icons
