import { ComponentType, ForwardRefExoticComponent, SFC } from 'react'
import * as z from 'zod'
import {
    ChildrenInspectorRenderer,
    ContainerLayoutProps,
} from '../inspector/InspectorProvider'
import { LayoutPropTypes } from '../inspector/Layout'

export type ID = string
export type MouldName = string
export type StateName = string
export type ComponentIndex = number
export type Desc = string

export type Vector = {
    x: number
    y: number
}

export type Size = {
    width: number
    height: number
}

export type ComponentPath = [MouldName, StateName]

export type Path = [ComponentPath, ComponentIndex[]]

export type View = {
    id: ID
    mouldName: MouldName
    state: StateName
} & Size &
    Vector

export type Workspace = {
    id: ID
    views: ID[]
    zoom?: number
} & Vector

export type Component = {
    type: string
    props: object
    children?: Component[]
}

//[prop-field, scope-field]
export type DataMappingVector = [string, string]

export type Kit = {
    name: ID
    type: string
    isList?: boolean
    param?: object
    dataMappingVector: DataMappingVector[]
}

export type InputConfig<Config = any> = {
    type: string
} & Config

export type Mould = {
    name: string
    scope: string[]
    kits: Kit[]
    input: { [key: string]: InputConfig }
    states: { [key: string]: Component | null }
}

export type ComponentPropTypes = {
    requestUpdateProps?: (props: object) => void
    requestUpdateChildren?: (
        updateChildren: (children?: Component[]) => Component[] | undefined
    ) => void
    path?: Path
    connectedFields?: string[]
} & Component

// export type Creating = ['waiting' | 'start' | 'updating', View]
export type Creating = {
    status: 'waiting' | 'start' | 'updating'
    view: View
    beginAt: Vector
    injectedKitName?: string
}

export type EditorState = {
    testWorkspace: Workspace
    views: { [key: string]: View }
    moulds: Mould[]
    selection?: Path //[[mouldName, state], indexPath[]]
    creating?: Creating
    recursiveRendered?: string[]
    isDragging?: boolean
    debugging: Debugging
}

export type ParentContextProps = {
    parent?: ParentContext
}
export type ParentContext = {
    props: object
    component: AtomicComponent
    childrenIndex: number
}

export type ChildrenMoveable = SFC<{
    target: HTMLElement
    requestUpdateProps: (prop: {
        containerLayoutProps?: ContainerLayoutProps
        layoutProps?: LayoutPropTypes
    }) => void
    props: {
        containerLayoutProps?: ContainerLayoutProps
        layoutProps?: LayoutPropTypes
    }
}>

export type AtomicComponent = {
    type: string
    Standard?: z.ZodObject<{ [key: string]: any }>
    Icon: ComponentType
    Editable: ForwardRefExoticComponent<any>
    Raw: ForwardRefExoticComponent<any>
    Transform?: (args: object, context?: ParentContext) => object
    ChildrenTransform?: (
        data: ContainerLayoutProps | undefined,
        parentProps: object,
        index: number
    ) => object
    ChildrenInspectorRenderer?: ChildrenInspectorRenderer
    ChildrenMoveable?: ChildrenMoveable
    acceptChildren?: boolean
}

export type useScopeFn = (input: object) => [object, StateName]

export type InspectorProps<T, Option = {}> = {
    data: T | undefined
    onChange: (data: T | undefined) => void
    title?: string
    connectedFields?: string[]
} & Option

export type Inspector<T, Option = {}> = SFC<InspectorProps<T, Option>>

export type Debugging = [ComponentPath | undefined, any?]
