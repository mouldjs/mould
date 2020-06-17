import React, { forwardRef } from 'react'
import { pick } from 'ramda'
import { Mould, useScopeFn, Component } from '../app/types'
import Components from '../components'
import List from '../components/List'
import resolvers from '../.mould/resolvers'
import { find } from 'lodash'
import { Kit } from '../app/types'
const returnEmptyObject = (defaultState) => (): [string, object] => {
    return [defaultState, {}]
}

const getKit = (component: { props }, kits: Kit[]) => {
    const kitName = component.props.__kitName
    return find(kits, (k) => k.name === kitName)
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
                        const kit = getKit(component, kits)
                        const kitName = kit?.name

                        if (!kit) {
                            throw Error(`Can not find kit: ${kitName}`)
                        }
                        const { isList } = kit
                        if (!isList) {
                            const kitProps: any = {
                                ...kit!.dataMappingVector.reduce(
                                    (res, [propField, scopeField]) => {
                                        res[propField] = scope[scopeField]
                                        return res
                                    },
                                    {}
                                ),
                                ...props,
                            }

                            props = kitProps.textProps
                                ? {
                                      ...kitProps,
                                      content:
                                          scope['content'] ||
                                          kitProps.textProps.content, // content key is unique because it determine the display when debugging
                                  }
                                : kitProps

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
                                let kitProps = {
                                    ...kit!.dataMappingVector.reduce(
                                        (res, [propField, scopeField]) => {
                                            res[propField] = scope[scopeField]
                                            return res
                                        },
                                        {}
                                    ),
                                }

                                if (kit?.type === 'Mould') {
                                    kitProps = {
                                        ...kitProps,
                                        __mouldName: (kit.param as any)
                                            .mouldName,
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
            } else {
                if (rootComponent.type === 'Kit') {
                    const RootComp = Components.find(
                        (c) => c.type === getKit(rootComponent, kits)?.type
                    )!.Raw

                    return (
                        <RootComp {...rootComponent.props} ref={ref}>
                            {rootComponent.children &&
                                renderChildren(rootComponent.children)}
                        </RootComp>
                    )
                } else {
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
            }
        }
    )

    return RuntimeMould
}
