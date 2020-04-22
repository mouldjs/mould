import { useDispatch } from 'react-redux'
import { Flex, Text } from '@modulz/radix'
import { Plus, Maximize } from 'react-feather'
import { waitingForCreating } from '../appShell'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import nanoid from 'nanoid'

const AddMouldTrigger = () => {
    const dispatch = useDispatch()

    return (
        <Popover interactionKind={PopoverInteractionKind.HOVER}>
            <Flex
                px={10}
                py={5}
                alignItems="center"
                justifyContent="center"
                sx={{ flexDirection: 'column' }}
                onClick={() =>
                    dispatch(
                        waitingForCreating({
                            mouldId: nanoid(6),
                            stateName: 'state 0',
                        })
                    )
                }
            >
                <Plus color="#fff"></Plus>
                <Text as="p" mt={5} sx={{ color: 'white' }}>
                    Add Mould
                </Text>
            </Flex>
            <Flex
                p={10}
                width="180px"
                alignItems="center"
                justifyContent="center"
                sx={{ flexDirection: 'column', fontSize: '14px' }}
            >
                <Maximize size={32} color="#666"></Maximize>
                <Text
                    as="p"
                    mt={15}
                    sx={{ color: '#666', textAlign: 'center' }}
                >
                    Create a Mould view.
                </Text>
                <Text as="p" mt={10} sx={{ color: '#666', lineHeight: '1.3' }}>
                    Hit M and click anywhere in workspace to start drag a new
                    Mould view, also you can drag a box after cursor change to
                    +.
                </Text>
            </Flex>
        </Popover>
    )
}

export default AddMouldTrigger
