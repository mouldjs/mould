import {
    createContext,
    ReactNode,
    SFC,
    useContext,
    ReactElement,
    Provider,
} from 'react'
import { CSSProperties } from 'styled-components'
import * as z from 'zod'
import { Layout } from '../standard/common'

export type FlexProps = {
    grow: number
    shrink: number
}

export type RelativeProps = {
    left: number
    top: number
    right: number
    bottom: number
}

export interface ContainerLayoutProps {
    flex?: FlexProps
    relative?: RelativeProps
}

export type ChildrenInspectorRenderer = (
    data: ContainerLayoutProps,
    onChange: (newData: ContainerLayoutProps) => void
) => ReactElement

interface ContainerLayoutContext {
    renderer: ChildrenInspectorRenderer
    transform: (data: ContainerLayoutProps) => CSSProperties
}

const ctx = createContext<ContainerLayoutContext | null>(null)
ctx.displayName = 'ContainerLayoutProvider'

export const ContainerRelatedInspectors: SFC<{
    data: ContainerLayoutProps
    onChange: (newData: ContainerLayoutProps) => void
}> = ({ data, onChange }) => {
    const context = useContext(ctx)
    if (context) {
        return context.renderer(data, onChange)
    }
    return null
}

export const ChildrenLayoutInspectorProvider: SFC<ContainerLayoutContext> = ({
    renderer,
    transform,
    children,
}) => {
    const Provider = ctx.Provider
    return <Provider value={{ transform, renderer }}>{children}</Provider>
}

export function useLayoutProps(
    props: ContainerLayoutProps
): z.infer<typeof Layout> {
    const context = useContext(ctx)
    if (context) {
        const transform = context.transform
        const style = transform(props)
        return {
            flexGrow: style.flexGrow?.toString(),
            flexShrink: style.flexShrink?.toString(),
        }
    }
    return {}
}
