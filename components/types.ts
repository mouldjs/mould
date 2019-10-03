export type Vector = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
};

export type View = {
    id: string;
} & Size;

export type ViewGroup = {
    id: string;
    name?: string;
    active?: number;
    views: string[];
} & Vector;

export type Workspace = {
    id: string;
    viewGroups: string[];
    zoom?: number;
} & Vector;

export type Component = {
    id: string;
    scope: string[];
    states: string[];
    tree: object;
    input: string[];
};

export type EditorState = {
    testWorkspace: Workspace;
    viewGroups: { [key: string]: ViewGroup };
    views: { [key: string]: View };
    components: { [key: string]: View };
};
