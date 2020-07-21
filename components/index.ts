import { Cpu, Code } from 'react-feather'
import { AtomicComponent } from '../app/types'
import Mould from './Mould'
import Kit from './Kit'
import * as Stack from './Stack'
import * as Frame from './Frame'
import * as Text from './Text'
import * as Input from './Input'
import * as Icon from './Icon'

export default [
    {
        type: 'Stack',
        ...Stack,
    },
    {
        type: 'Frame',
        ...Frame,
    },
    {
        type: 'Text',
        ...Text,
    },
    {
        type: 'Input',
        ...Input,
    },
    {
        type: 'Icon',
        ...Icon,
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
