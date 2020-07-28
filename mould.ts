import { Cpu, Code } from 'react-feather'
import Components from './components'
import Mould from './components/Mould'
import Kit from './components/Kit'
import Controls from './controls'
import setup from './.mould/setup'
import { AtomicComponent } from './app/types'

type ComponentsByType = {
    [key: string]: AtomicComponent['Raw']
}
type TransformsByType = {
    [key: string]: AtomicComponent['Transform']
}

type AtomicComponentByType = {
    [key: string]: AtomicComponent | undefined
}

const MouldComp = {
    type: 'Mould',
    Editable: Mould,
    Raw: Mould,
    Icon: Cpu,
}

const KitComp = {
    type: 'Kit',
    Editable: Kit,
    Raw: Kit,
    Icon: Code,
}

const MouldInstance = {
    Components,
    Controls,
    get transforms() {
        return this.Components.reduce(
            (transformsByType, { type, Transform }) => ({
                ...transformsByType,
                [type]: Transform,
            }),
            {} as TransformsByType
        )
    },
    get components() {
        return this.Components.reduce(
            (componentsByType, { type, Raw }) => ({
                ...componentsByType,
                [type]: Raw,
            }),
            {} as ComponentsByType
        )
    },
    get definitions() {
        return this.Components.reduce(
            (atomicComponentsByType, definition) => ({
                ...atomicComponentsByType,
                [definition.type]: definition,
            }),
            {} as AtomicComponentByType
        )
    },
    getComponent(type) {
        switch (type) {
            case 'Mould':
                return MouldComp
            case 'Kit':
                return KitComp
            default:
                return this.Components.find((c) => c.type === type)
        }
    },
    getControl(type) {
        return this.Controls[type]
    },
}

type InsType = typeof MouldInstance

const extentions: InsType = (setup as any)(MouldInstance)
Object.assign(MouldInstance.Components, extentions.Components)
Object.assign(MouldInstance.Controls, extentions.Controls)

export default MouldInstance
