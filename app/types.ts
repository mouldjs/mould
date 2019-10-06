export type Vector = {
    x: number
    y: number
}

export type Size = {
    width: number
    height: number
}

export type View = {
    id: string
} & Size

export type ViewGroup = {
    id: string
    name?: string
    active?: number
    views: string[]
    mouldId: string
} & Vector

export type Workspace = {
    id: string
    viewGroups: string[]
    zoom?: number
} & Vector

export type Component = {
    type: string
    props: object
    children?: Component[]
}

export type Mould = {
    id: string
    scope: string[]
    input: string[]
    states: string[]
    tree: Component
}

export type ComponentPropTypes = {
    requestUpdateProps: (props: object) => void
    path: number[]
} & Component

export type EditorState = {
    testWorkspace: Workspace
    viewGroups: { [key: string]: ViewGroup }
    views: { [key: string]: View }
    moulds: { [key: string]: Mould }
    selection?: number[]
}
