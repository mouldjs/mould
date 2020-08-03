import { AtomicComponent } from '../app/types'
import * as Stack from './Stack'
import * as Frame from './Frame'
import * as Text from './Text'
import * as Input from './Input'
import * as Icon from './Icon'

export default ([
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
] as unknown) as AtomicComponent[]
