import AddMouldTrigger from './AddMouldTrigger'
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
        </Flex>
    )
}

export default Toolbar
