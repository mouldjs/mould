import AddMouldTrigger from './AddMouldTrigger'
import PanelTrigger from './PanelTrigger'
import { Flex } from '@modulz/radix'
import Icons from './Icons'

const Toolbar = () => {
    return (
        <Flex
            position="relative"
            backgroundColor="#333"
            alignItems="center"
            justifyContent="center"
            height="100%"
        >
            <AddMouldTrigger></AddMouldTrigger>
            <Flex> {Icons} </Flex>
            <PanelTrigger></PanelTrigger>
        </Flex>
    )
}

export default Toolbar
