import React, { forwardRef } from 'react'
import { pick } from 'ramda'
import { Mould, ComponentProps, useScopeFn, Component, ID } from '../app/types'
import Root from '../components/Root'
import Components from '../components'
import List from '../components/List'
import './tempFunctions'

const RootComp = Root as any

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
            } & ComponentProps,
            ref
        ) => {
            const __mouldProps = moulds[__mouldId]
            const { input, states, kits, hookFunctionName } = __mouldProps
            let useScope: useScopeFn =
                hookFunctionName && window[hookFunctionName]

            if (!useScope) {
                useScope = returnEmptyObject(Object.keys(states)[0])
            }

            const [currentState, scope] = useScope(pick(input, rest))

            const renderChildren = (components: Component[]) => {
                return components.map((component) => {
                    let Comp = Components.find(
                        (c) => c.type === component.type
                    )!.component
                    let { props, children } = component
                    if (component.type === 'Kit') {
                        const kitName = (component as any).props.__kitName
                        const kit = kits.find((k) => k.name === kitName)
                        if (!kit) {
                            return null
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
                                Comp = Components.find(
                                    (c) => c.type === kit!.type
                                )!.component
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

                    return (
                        <Comp {...props}>
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
            )!.component

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
