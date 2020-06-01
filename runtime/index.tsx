import React, { forwardRef } from 'react'
import { pick } from 'ramda'
import { Mould, useScopeFn, Component, ID } from '../app/types'
import Components from '../components'
import List from '../components/List'
import './tempFunctions'

const returnEmptyObject = (defaultState) => (): [string, object] => {
    return [defaultState, {}]
}

export const runtime = (moulds: { [key: string]: Mould }) => {
    const RuntimeMould = forwardRef(
        (
            {
                __mouldId,
                ...rest
            }: {
                __mouldId: ID
            },
            ref
        ) => {
            const __mouldProps = moulds[__mouldId]
            const { input, states, kits, hookFunctionName } = __mouldProps
            let useScope: useScopeFn =
                hookFunctionName && window[hookFunctionName]

            if (!useScope) {
                useScope = returnEmptyObject(Object.keys(states)[0])
            }

            const [currentState, scope] = useScope(
                pick(Object.keys(input), rest)
            )

            const renderChildren = (components: Component[]) => {
                return components.map((component) => {
                    const Plugin = Components.find(
                        (c) => c.type === component.type
                    )

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
                                    __mouldId: (kit!.param as any).mouldId,
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
                                        __mouldId: (kit.param as any).mouldId,
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
                        <Comp {...styledProps} {...props}>
                            {children && renderChildren(children)}
                        </Comp>
                    )
                })
            }

            const rootComponent = states[currentState]
            if (!rootComponent) {
                return null
            }
            const RootComp = Components.find(
                (c) => c.type === rootComponent.type
            )!.Raw

            return (
                <RootComp {...rootComponent.props} ref={ref}>
                    {rootComponent.children &&
                        renderChildren(rootComponent.children)}
                </RootComp>
            )
        }
    )

    return RuntimeMould
}
