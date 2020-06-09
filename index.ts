import Components from './components'

export const components = {}
export const transforms = {}

Components.forEach((comp) => {
    components[comp.type] = comp.Raw
    transforms[comp.type] = comp.Transform
})
