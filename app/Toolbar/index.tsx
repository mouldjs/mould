import AddMouldTrigger from './AddMouldTrigger'
import MouldStates from './MouldStates'
import { Flex } from '@modulz/radix'
import Icons from './Icons'

const Toolbar = () => {
    return (
        <Flex
            backgroundColor="#333"
            alignItems="center"
            justifyContent="center"
            height="100%"
        >
            <AddMouldTrigger></AddMouldTrigger>
            <Flex> {Icons} </Flex>
            <MouldStates></MouldStates>
        </Flex>
    )
}

export default Toolbar
