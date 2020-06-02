import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EditorState } from '../types'
import { Text } from '@modulz/radix'
import { waitingForCreating } from '../appShell'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Layers, Move, Type } from 'react-feather'
import { useDrag } from 'react-dnd'
import { useCurrentMould } from '../utils'
import { delay } from 'lodash'
import nanoid from 'nanoid'

const icons = ['Stack', 'Text']
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
    }
    return baseComponents[name]
}

const Icon = ({ name, onHover, onPopoverOpened, isOpen }) => {
    const dispatch = useDispatch()
    const creating = useSelector((state: EditorState) => state.creating)
    const currentMould = useCurrentMould()
    const [, drag] = useDrag({ item: { type: 'TREE', name } })
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
                        mouldId: string
                        stateName: string
                        injectedKitName: string
                    } = {
                        mouldId: '',
                        stateName: '',
                        injectedKitName: '',
                    }

                    if (currentMould) {
                        waitingParams.mouldId = currentMould.id
                        waitingParams.stateName = `state ${
                            Object.keys(currentMould.states).length
                        }`
                        waitingParams.injectedKitName = name
                    } else {
                        waitingParams.mouldId = nanoid(6)
                        waitingParams.stateName = 'state 0'
                        waitingParams.injectedKitName = name
                    }

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
