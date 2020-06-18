import React, { forwardRef } from 'react'
import { pick } from 'ramda'
import { Mould, useScopeFn, Component } from '../app/types'
import Components from '../components'
import List from '../components/List'
import resolvers from '../.mould/resolvers'

const returnEmptyObject = (defaultState) => (): [string, object] => {
    return [defaultState, {}]
}

export const runtime = (moulds: Mould[]) => {
    const RuntimeMould = forwardRef(
        (
            {
                __mouldName,
                ...rest
            }: {
                __mouldName: string
            },
            ref
        ) => {
            const __mouldProps = moulds.find((m) => m.name === __mouldName)!
            const { input, states, kits } = __mouldProps
            let useScope: useScopeFn = resolvers[__mouldName]

            if (!useScope) {
                useScope = returnEmptyObject(Object.keys(states)[0])
            }

            const [currentState, scope] = useScope(
                pick(Object.keys(input), rest)
            )

            const renderComp = (component, isRoot) => {
                const Plugin = Components.find((c) => c.type === component.type)

                if (!Plugin) {
                    throw Error(`Can not find plugin: ${component.type}`)
                }

                let Comp = Plugin.Raw
                let transform = Plugin.Transform

                let { props, children } = component
                if (component.type === 'Kit') {
                    const kitName = (component as any).props.__kitName
                    const kit = kits.find((k) => k.name === kitName)
                    if (!kit) {
                        throw Error(`Can not find kit: ${kitName}`)
                    }
                    const { isList } = kit
                    if (!isList) {
                        const kitProps = { ...props }
                        kit!.dataMappingVector.forEach(
                            ([propField, scopeField]) => {
                                kitProps[propField] = scope[scopeField]
                            }
                        )
                        props = kitProps
                        if (kit?.type === 'Mould') {
                            props = {
                                ...props,
                                __mouldName: (kit!.param as any).mouldName,
                            } as any
                            Comp = RuntimeMould
                        } else {
                            const Plugin = Components.find(
                                (c) => c.type === kit.type
                            )
                            if (!Plugin) {
                                throw Error(
                                    `Can not find plugin in kit: plugin ${kit.type}, kit ${kit.name}`
                                )
                            }

                            Comp = Plugin.Raw
                            transform = Plugin.Transform
                        }
                    } else {
                        Comp = List
                        const scopeForThis = scope[kitName]
                        children = scopeForThis.map((scope) => {
                            let kitProps = {}
                            kit!.dataMappingVector.forEach(
                                ([propField, scopeField]) => {
                                    kitProps[propField] = scope[scopeField]
                                }
                            )
                            if (kit?.type === 'Mould') {
                                kitProps = {
                                    ...kitProps,
                                    __mouldName: (kit.param as any).mouldName,
                                } as any
                            }

                            return { type: kit?.type, props: kitProps }
                        })
                    }
                }

                if (component.type === 'Mould') {
                    Comp = RuntimeMould
                }

                if (!Comp) {
                    return null
                }

                const styledProps = transform ? transform(props) : {}
                // const styledProps = {}

                return (
                    <Comp
                        {...styledProps}
                        {...props}
                        ref={isRoot ? ref : undefined}
                    >
                        {children && renderChildren(children)}
                    </Comp>
                )
            }

            const renderChildren = (components: Component[]) => {
                return components.map((c) => renderComp(c, false))
            }

            const rootComponent = states[currentState]
            if (!rootComponent) {
                return null
            }

            return renderComp(rootComponent, true)
        }
    )

    return RuntimeMould
}
