import React, { forwardRef } from 'react'
import { pick } from 'ramda'
import {
    Mould,
    useScopeFn,
    Component,
    AtomicComponent,
    ParentContext,
} from '../app/types'
import MouldApp from '../mould'
import List from '../components/List'
import resolvers from '../.mould/resolvers'

const returnEmptyObject = (defaultState) => (): [object, string] => {
    return [{}, defaultState]
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

            const [scope, currentState] = useScope(
                pick(Object.keys(input), rest)
            )

            const renderComp = (
                component: Component,
                isRoot: boolean,
                parent?: ParentContext
            ) => {
                const Plugin = MouldApp.getComponent(component.type)

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
                            const Plugin = MouldApp.getComponent(kit.type)
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

                const styledProps = transform ? transform(props, parent) : {}
                // const styledProps = {}

                return (
                    <Comp
                        {...styledProps}
                        {...props}
                        ref={isRoot ? ref : undefined}
                    >
                        {children && renderChildren(children, props, Plugin)}
                    </Comp>
                )
            }

            const renderChildren = (
                components: Component[],
                props: object,
                plugin: AtomicComponent
            ) => {
                return components.map((c, index) => {
                    const context: ParentContext = {
                        props,
                        component: plugin,
                        childrenIndex: index,
                    }
                    return renderComp(c, false, context)
                })
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
