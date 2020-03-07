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

export type Component = {
    type: string
    props: object
    children?: Component[]
}

export type Mould = {
    id: string
    name?: string
    scope: string[]
    input: { [key: string]: Desc }
    states: { [key: string]: Component | null }
}

export type ComponentPropTypes = {
    requestUpdateProps: (props: object) => void
    path: Path
} & Component

export type Creating = ['waiting' | 'start' | 'updating', View]

export type EditorState = {
    testWorkspace: Workspace
    views: { [key: string]: View }
    moulds: { [key: string]: Mould }
    selection?: Path //[mouldId, state, ...path]
    creating?: Creating
}
