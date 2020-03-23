import React, { forwardRef } from 'react'
import { pick } from 'ramda'
import { Mould, ComponentProps, useScopeFn, Component, ID } from '../app/types'
import Root from '../components/Root'
import Components from '../components'

const RootComp = Root as any

const returnEmptyObject = defaultState => (): [string, object] => {
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
            const {
                input,
                rootProps,
                states,
                kits,
                hookFunctionName,
            } = __mouldProps
            let useScope: useScopeFn =
                hookFunctionName && window[hookFunctionName]

            if (!useScope) {
                useScope = returnEmptyObject(Object.keys(states)[0])
            }

            const [currentState, scope] = useScope(pick(input, rest))

            const renderChildren = (components: Component[]) => {
                return components.map(component => {
                    let Comp = Components.find(c => c.type === component.type)!
                        .component
                    let { props, children } = component
                    if (component.type === 'Kit') {
                        const kitName = (component as any).props.__kitName
                        const kit = kits.find(k => k.name === kitName)
                        const kitProps = { ...component.props }
                        kit!.dataMappingVector.forEach(
                            ([propField, scopeField]) => {
                                kitProps[propField] = scope[scopeField]
                            }
                        )
                        props = kitProps
                        Comp = Components.find(c => c.type === kit!.type)!
                            .component
                    }

                    if (component.type === 'Mould') {
                        Comp = RuntimeMould
                    }

                    if (!Comp) {
                        return null
                    }

                    return <Comp {...props}>{renderChildren(children)}</Comp>
                })
            }

            return (
                <RootComp {...rootProps} ref={ref}>
                    {renderChildren(states[currentState])}
                </RootComp>
            )
        }
    )

    return RuntimeMould
}
