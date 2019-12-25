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
    views: { [key: string]: string }
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

type Desc = string

export type Mould = {
    id: string
    name?: string
    scope: string[]
    input: { [key: string]: Desc }
    states: { [key: string]: Component }
}

export type Path = [string, string, ...number[]]

export type ComponentPropTypes = {
    requestUpdateProps: (props: object) => void
    path: Path
} & Component

export type EditorState = {
    testWorkspace: Workspace
    viewGroups: { [key: string]: ViewGroup }
    views: { [key: string]: View }
    moulds: { [key: string]: Mould }
    selection?: Path | string //[mouldId, state, ...path] | mouldId
}
