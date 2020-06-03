import { useDispatch } from 'react-redux'
import { Flex, Text } from '@modulz/radix'
import { Plus, Maximize } from 'react-feather'
import { waitingForCreating } from '../appShell'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import nanoid from 'nanoid'

const AddMouldTrigger = () => {
    const dispatch = useDispatch()

    return (
        <Popover interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}>
            <div
                className="m-r-lg"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
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
                <p className={`clickable m-t-sm m-b-0 pure`}>Add Mould</p>
            </div>
            <Flex
                translate
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
                <Text
                    as="p"
                    size={2}
                    mt={10}
                    sx={{ color: '#666', lineHeight: '1.3' }}
                >
                    Hit M and click anywhere in workspace to start drag a new
                    Mould view, also you can drag a box after cursor change to
                    +.
                </Text>
            </Flex>
        </Popover>
    )
}

export default AddMouldTrigger
