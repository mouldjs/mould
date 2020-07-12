import { EditorState, Mould, Component, ParentContext } from '../app/types'
import MouldApp from '../mould'

const ensureComponentName = (mouldName: string) =>
    mouldName[0].toUpperCase() + mouldName.substring(1)

const RESOLVERS = 'resolvers'
const MOULD = 'mould'

export const transformMouldToReactComponent = (mould: Mould): string => {
    const { name, scope, kits, input, states } = mould
    const mouldName = ensureComponentName(name!)

    const generateComponent = (comp: Component, context?: ParentContext) => {
        const { type, props, children = [] } = comp
        let compType = `${MOULD}.components.${type}`
        const plugin = MouldApp.definitions[type]
        const propsClone = { ...props }
        delete propsClone['__mouldName']
        delete propsClone['__kitName']

        let propsStr = ''
        // let propsStr = `${Object.keys(propsClone).reduce((prev, curr) => {
        //     const value = propsClone[curr]
        //     if (value === undefined) {
        //         return prev
        //     }

        //     return prev + ` ${curr}={${JSON.stringify(value)}}`
        // }, '')}`

        if (type === 'Kit') {
            const kitName = props['__kitName']
            const kit = kits.find((k) => k.name === kitName)
            if (!kit) {
                throw Error(`Can't find kit: ${kitName}`)
            }
            const { dataMappingVector, name, isList, param, type } = kit
            if (type === 'Mould') {
                compType = ensureComponentName((param as any).mouldName)
            } else {
                compType = `${MOULD}.components.${type}`
            }

            if (isList) {
                let rawProps = propsClone

                if (type !== 'Mould') {
                    const transform = MouldApp.transforms[type]!
                    rawProps = transform(propsClone, context)
                }

                dataMappingVector.forEach(([propField, scopeField]) => {
                    delete rawProps[propField]
                    propsStr += `${propField}={scopes[${scopeField}]}`
                })
                propsStr =
                    `${Object.keys(rawProps).reduce((prev, curr) => {
                        const value = rawProps[curr]
                        if (value === undefined) {
                            return prev
                        }

                        return prev + ` ${curr}={${JSON.stringify(value)}}`
                    }, '')}` + propsStr

                return `<>
                    {scopes.${name}.map((scopes) => {
                        return (<${compType} ${propsStr} >
                            ${children
                                .map((child) => generateComponent(child))
                                .join('\n')}
                        </${compType}>)
                    })}
                <>`
            } else {
                let rawProps = propsClone

                if (type !== 'Mould') {
                    const transform = MouldApp.transforms[type]!
                    rawProps = transform(propsClone, context)
                }

                dataMappingVector.forEach(([propField, scopeField]) => {
                    delete rawProps[propField]
                    propsStr += `${propField}={scopes[${scopeField}]}`
                })
                propsStr =
                    `${Object.keys(rawProps).reduce((prev, curr) => {
                        const value = rawProps[curr]
                        if (value === undefined) {
                            return prev
                        }

                        return prev + ` ${curr}={${JSON.stringify(value)}}`
                    }, '')}` + propsStr
            }
        } else if (type === 'Mould') {
            compType = ensureComponentName(props['__mouldName'])
        } else {
            const transform = MouldApp.transforms[type]!
            const rawProps = transform(propsClone, context)

            propsStr = `${Object.keys(rawProps).reduce((prev, curr) => {
                const value = rawProps[curr]
                if (value === undefined) {
                    return prev
                }

                return prev + ` ${curr}={${JSON.stringify(value)}}`
            }, '')}`
        }

        return `<${compType} ${propsStr}>
            ${children
                .map((child, index) => {
                    if (plugin) {
                        const context: ParentContext = {
                            props,
                            component: plugin,
                            childrenIndex: index,
                        }
                        return generateComponent(child, context)
                    } else {
                        return generateComponent(child)
                    }
                })
                .join('\n')}
        </${compType}>`
    }

    const generateTreeCase = (stateName: string) => {
        const tree = states[stateName]
        if (!tree) return ''

        return `
        case ${JSON.stringify(stateName)}:
            return (
                ${generateComponent(tree)}
            )`
    }

    return `export const ${mouldName} = (props) => {
    const [scopes, stateName] = ${RESOLVERS}['${mouldName}'](props)

    switch(stateName) {
        ${Object.keys(states).map(generateTreeCase).join('\n')}
        default:
            return null
    }
}
`
}

export const transform = (schema: EditorState): string => {
    return `// Generated from Mould (github.com/mouldjs/mould)
import React from 'react'
import ${RESOLVERS} from './resolvers'
import * as ${MOULD} from '../mould'

${Object.values(schema.moulds).map(transformMouldToReactComponent).join('\n')}
`
}
