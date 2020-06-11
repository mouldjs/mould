import * as StringControl from './StringControl'
import * as NumberControl from './NumberControl'
import * as BooleanControl from './BooleanControl'
import { SFC } from 'react'
// import { ControlEditPanel } from '../app/types'

export default {
    string: StringControl,
    number: NumberControl,
    boolean: BooleanControl,
} as {
    [key: string]: {
        Editor: SFC
        Renderer: SFC<any>
    }
}
