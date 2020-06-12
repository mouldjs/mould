import * as StringControl from './StringControl'
import * as NumberControl from './NumberControl'
import * as BooleanControl from './BooleanControl'
import * as FunctionControl from './FunctionControl'
import { SFC } from 'react'
// import { ControlEditPanel } from '../app/types'

export default {
    string: StringControl,
    number: NumberControl,
    boolean: BooleanControl,
    function: FunctionControl,
} as {
    [key: string]: {
        Editor: SFC
        Renderer: SFC<any>
    }
}
