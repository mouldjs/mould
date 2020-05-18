import { useDispatch, useSelector } from 'react-redux'
import { Text } from '@modulz/radix'
import { waitingForCreating } from '../appShell'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Layers, Move } from 'react-feather'
import { useDrag } from 'react-dnd'
import { useCurrentMould } from '../utils'
import nanoid from 'nanoid'

const icons = ['Stack', 'Text']
const getIcon = (name) => {
    const baseComponents = {
        Text: {
            icon: <Type color="#fff"></Type>,
            descInPopover: (
                <>
                    <Move size={32} color="#666"></Move>
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
            icon: <Layers color="#fff"></Layers>,
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

const Icon = ({ name }) => {
    const dispatch = useDispatch()
    const currentMould = useCurrentMould()
    const [, drag] = useDrag({ item: { type: 'TREE', name } })
    const { icon, descInPopover } = getIcon(name)

    return (
        <Popover interactionKind={PopoverInteractionKind.HOVER}>
            <div
                style={{
                    padding: '5px 10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
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
                <Text as="p" mt={5} sx={{ color: 'white' }}>
                    {name}
                </Text>
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

export default icons.map((icon) => <Icon key={icon} name={icon}></Icon>)
