import { ComponentType, ForwardRefExoticComponent, SFC } from 'react'
import * as z from 'zod'
import { DOMAttributes } from '../lib/zodTypes'

export type ID = string
export type MouldID = ID
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

export type ComponentPath = [MouldID, StateName]

export type Path = [ComponentPath, ComponentIndex[]]

export type View = {
    id: ID
    mouldId: MouldID
    state: StateName
} & Size &
    Vector

export type Workspace = {
    id: ID
    views: ID[]
    zoom?: number
} & Vector

export const zodComponentProps = DOMAttributes

export type ComponentProps = z.TypeOf<typeof zodComponentProps>

export type Component = {
    type: string
    props: ComponentProps
    children?: Component[]
    kits?: Component[]
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
    id: string
    name?: string
    hookFunctionName?: string
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
}

export type EditorState = {
    testWorkspace: Workspace
    views: { [key: string]: View }
    moulds: { [key: string]: Mould }
    selection?: Path //[mouldId, state, ...path]
    creating?: Creating
    recursiveRendered?: string[]
}

export type AtomicComponent = {
    type: string
    Standard?: z.ZodObject<{ [key: string]: any }>
    Icon: ComponentType
    Editable: ForwardRefExoticComponent<any>
    Raw: ForwardRefExoticComponent<any>
}

export type useScopeFn = (input: object) => [StateName, object]

export type InspectorProps<T, Option = {}> = {
    data: T | undefined
    onChange: (data: T | undefined) => void
    title?: string
    connectedFields?: string[]
} & Option

export type Inspector<T, Option = {}> = SFC<InspectorProps<T, Option>>
