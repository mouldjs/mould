import * as StringControl from './StringControl'
import * as NumberControl from './NumberControl'
import { SFC } from 'react'
// import { ControlEditPanel } from '../app/types'

export default {
    string: StringControl,
    number: NumberControl,
} as {
    [key: string]: {
        Editor: SFC
        Renderer: SFC<any>
    }
}
