import { EditorState, Mould, Component } from '../app/types'

const ensureComponentName = (mouldName: string) =>
    mouldName[0].toUpperCase() + mouldName.substring(1)

const RESOLVERS = 'resolvers'
const MOULD = 'mould'

export const transformMouldToReactComponent = (mould: Mould): string => {
    const { name, scope, kits, input, states } = mould
    const mouldName = ensureComponentName(name!) //TODO remove mould id

    const generateComponent = (comp: Component) => {
        const { type, props, children = [] } = comp
        let compType = `${MOULD}.${type}`

        const propsClone = { ...props }
        delete propsClone['__mouldName']
        delete propsClone['__kitName']

        let propsStr = `${Object.keys(propsClone).reduce((prev, curr) => {
            const value = propsClone[curr]
            if (value === undefined) {
                return prev
            }

            return prev + ` ${curr}={${JSON.stringify(value)}}`
        }, '')}`

        if (type === 'Kit') {
            const kitName = props['__kitName']
            const kit = kits.find((k) => k.name === kitName)
            if (!kit) {
                throw Error(`Can't find kit: ${kitName}`)
            }
            const { dataMappingVector, name, isList, param, type } = kit
            if (type === 'Mould') {
                compType = (param as any).mouldName //TODO mouldId -> mouldName
            } else {
                compType = `${MOULD}.${type}`
            }

            if (isList) {
                propsStr = ''
                dataMappingVector.forEach(([propField, scopeField]) => {
                    delete propsClone[propField]
                    propsStr += `${propField}={scopes[${scopeField}]}`
                })
                propsStr += `${Object.keys(propsClone).reduce((prev, curr) => {
                    const value = propsClone[curr]
                    if (value === undefined) {
                        return prev
                    }

                    return prev + ` ${curr}={${JSON.stringify(value)}}`
                }, '')}`

                return `<>
                    {scopes.${name}.map((scopes) => {
                        return (<${compType} ${propsStr} >
                            ${children.map(generateComponent).join('\n')}
                        </${compType}>)
                    })}
                <>`
            } else {
                propsStr = ''
                dataMappingVector.forEach(([propField, scopeField]) => {
                    delete propsClone[propField]
                    propsStr += `${propField}={scopes[${scopeField}]}`
                })
                propsStr += `${Object.keys(propsClone).reduce((prev, curr) => {
                    const value = propsClone[curr]
                    if (value === undefined) {
                        return prev
                    }

                    return prev + ` ${curr}={${JSON.stringify(value)}}`
                }, '')}`
            }
        }

        if (type === 'Mould') {
            compType = props['__mouldName']
        }

        return `<${compType} ${propsStr}>
            ${children.map(generateComponent).join('\n')}
        </${compType}>`
    }

    const generateTreeCase = (stateName: string) => {
        const tree = states[stateName]
        if (!tree) return ''

        return `
            case ${stateName}:
                return ${generateComponent(tree)}
        `
    }

    return `
const ${mouldName} = (props) => {
    const [scopes, stateName] = ${RESOLVERS}['${mouldName}'](props)

    switch(stateName) {
        ${Object.keys(states).map(generateTreeCase).join('\n')}
    }
}
`
}

export const transform = (schema: EditorState): string => {
    return `// Generated from Mould (github.com/mouldjs/mould)
import ${RESOLVERS} from 'mould/user_land'
import ${MOULD} from 'mould'

${Object.values(schema.moulds).map(transformMouldToReactComponent).join('\n\n')}
`
}
