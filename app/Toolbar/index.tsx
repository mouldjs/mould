import AddMouldTrigger from './AddMouldTrigger'
import PanelTrigger from './PanelTrigger'
import { Flex } from '@modulz/radix'
import Icons from './Icons'
import { useSelector } from 'react-redux'
import { transform } from '../../compile/transform'
import { EditorState } from '../types'

const Toolbar = () => {
    const state = useSelector((state: EditorState) => state)

    return (
        <Flex
            translate
            position="relative"
            backgroundColor="#333"
            alignItems="center"
            justifyContent="center"
            height="100%"
        >
            <button
                onClick={() => {
                    console.log(transform(state))
                }}
            >
                test
            </button>
            <AddMouldTrigger></AddMouldTrigger>
            <Flex translate>
                {' '}
                <Icons></Icons>{' '}
            </Flex>
            <PanelTrigger></PanelTrigger>
        </Flex>
    )
}

export default Toolbar
