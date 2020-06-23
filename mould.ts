import { AtomicComponent } from './app/types'
import Components from './components'

type ComponentsByType = {
    [key: string]: AtomicComponent['Raw']
}
type TransformsByType = {
    [key: string]: AtomicComponent['Transform']
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
