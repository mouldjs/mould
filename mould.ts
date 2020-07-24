import { AtomicComponent } from './app/types'
import Components from './components'

type ComponentsByType = {
    [key: string]: AtomicComponent['Raw']
}
type TransformsByType = {
    [key: string]: AtomicComponent['Transform']
}

type AtomicComponentByType = {
    [key: string]: AtomicComponent | undefined
}

export const components: ComponentsByType = Components.reduce(
    (componentsByType, { type, Raw }) => ({
        ...componentsByType,
        [type]: Raw,
    }),
    {} as ComponentsByType
)
export const transforms: TransformsByType = Components.reduce(
    (transformsByType, { type, Transform }) => ({
        ...transformsByType,
        [type]: Transform,
    }),
    {} as TransformsByType
)
export const definitions: AtomicComponentByType = Components.reduce(
    (atomicComponentsByType, definition) => ({
        ...atomicComponentsByType,
        [definition.type]: definition,
    }),
    {} as AtomicComponentByType
)
