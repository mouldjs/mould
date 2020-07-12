import Components from './components'
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

const Base = {
    Components,
    Controls,
}

const Mould = {
    ...Base,
    ...setup(Base),
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
        return Components.reduce(
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
        return this.Components.find((c) => c.type === type)
    },
    getControl(type) {
        return this.Controls[type]
    },
}

export default Mould
