import React, { SFC, ReactElement } from 'react'
import { LayoutSize } from './Layout'
import { ParentContext } from '../app/types'

export type FlexProps = {
    grow: number
    shrink: number
}

export type RelativeProps = {
    left: LayoutSize
    top: LayoutSize
    right: LayoutSize
    bottom: LayoutSize
}

export interface ContainerLayoutProps {
    flex?: FlexProps
    relative?: RelativeProps
}

export type ChildrenInspectorRenderer = (
    data: ContainerLayoutProps | undefined,
    onChange: (newData: ContainerLayoutProps) => void
) => ReactElement

export const ContainerRelatedInspectors: SFC<{
    parent?: ParentContext
    data: ContainerLayoutProps | undefined
    onChange: (newData: ContainerLayoutProps) => void
}> = ({ parent, data, onChange }) => {
    const renderer = parent?.component.ChildrenInspectorRenderer
    if (renderer) {
        return renderer(data, onChange)
    }
    return null
}

export function getPropsFromParent(
    context?: ParentContext,
    containerLayoutProps?: ContainerLayoutProps
) {
    if (context && context.component.ChildrenTransform) {
        return context.component.ChildrenTransform(
            containerLayoutProps,
            context.props,
            context.childrenIndex
        )
    }
    return {}
}
