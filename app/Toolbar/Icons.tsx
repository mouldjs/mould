import { Flex, Text } from '@modulz/radix'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Layers, Image, Type, Italic, Move } from 'react-feather'
import { useDrag } from 'react-dnd'

const icons = ['Text', 'Stack', 'Image', 'Input']
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
        Image: {
            icon: <Image color="#fff"></Image>,
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
        Input: {
            icon: <Italic color="#fff"></Italic>,
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
    }
    return baseComponents[name]
}

const Icon = ({ name }) => {
    const [, drag] = useDrag({ item: { type: 'TREE', name } })
    const { icon, descInPopover } = getIcon(name)
    return (
        <Popover interactionKind={PopoverInteractionKind.HOVER}>
            <Flex
                px={10}
                py={5}
                ref={drag}
                alignItems="center"
                justifyContent="center"
                sx={{ flexDirection: 'column' }}
            >
                {icon}
                <Text as="p" mt={5} sx={{ color: 'white' }}>
                    {name}
                </Text>
            </Flex>
            <Flex
                p={10}
                width="180px"
                alignItems="center"
                justifyContent="center"
                sx={{ flexDirection: 'column', fontSize: '14px' }}
            >
                {descInPopover}
            </Flex>
        </Popover>
    )
}

export default icons.map((icon) => <Icon key={icon} name={icon}></Icon>)
