import { ComponentType, ForwardRefExoticComponent } from 'react'
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

// export type ViewGroup = {
//     id: ID
//     views: { [key: string]: string }
//     mouldId: MouldID
// } & Vector

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
}

//[scope-field, prop-field]
export type DataMappingVector = [string, string]

export type Kit = {
    name: ID
    type: string
    isList?: boolean
    param?: object
    dataMappingVector: DataMappingVector[]
}

export type Mould = {
    id: string
    name?: string
    hookFunctionName?: string
    scope: string[]
    kits: Kit[]
    // input: { [key: string]: Desc }
    input: string[]
    states: { [key: string]: Component | null }
}

export type ComponentPropTypes = {
    requestUpdateProps?: (props: object) => void
    requestUpdateChildren?: (
        updateChildren: (children?: Component[]) => Component[] | undefined
    ) => void
    path?: Path
} & Component

export type Creating = ['waiting' | 'start' | 'updating', View]

export type EditorState = {
    testWorkspace: Workspace
    views: { [key: string]: View }
    moulds: { [key: string]: Mould }
    selection?: Path //[mouldId, state, ...path]
    creating?: Creating
}

export type AtomicComponent = {
    type: string
    component: ForwardRefExoticComponent<any>
    icon: ComponentType
    propType: z.ZodObject<{ [k: string]: any }>
}

export type useScopeFn = (input: object) => [StateName, object]
