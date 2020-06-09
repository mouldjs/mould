import { Cpu, Code } from 'react-feather'
import { AtomicComponent } from '../app/types'
import Mould from './Mould'
import Kit from './Kit'
import * as Stack from './Stack'
import * as Text from './Text'
import * as Input from './Input'

export default [
    {
        type: 'Stack',
        ...Stack,
    },
    {
        type: 'Text',
        ...Text,
    },
    {
        type: 'Input',
        ...Input,
    },

    //TODO: move Kit and Mould to /app
    {
        type: 'Kit',
        Editable: Kit,
        Raw: Kit,
        Icon: Code,
    },
    {
        type: 'Mould',
        Editable: Mould,
        Raw: Mould,
        Icon: Cpu,
    },
] as AtomicComponent[]
