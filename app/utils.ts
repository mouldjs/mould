import {
    EditorState,
    Path,
    StateName,
    MouldID,
    Mould,
    Component,
    ComponentProps,
} from './types'
import { useSelector } from 'react-redux'
import data from './initialData'

// export const initialData: EditorState = {
//     testWorkspace: {
//         id: '1234',
//         x: 0,
//         y: 0,
//         views: ['a'],
//     },
//     views: {
//         a: {
//             id: 'a',
//             mouldId: 'testMould',
//             state: 'default',
//             width: 300,
//             height: 500,
//             x: 100,
//             y: 100,
//         },
//     },
//     moulds: {
//         testMould: {
//             id: 'testMould',
//             name: 'Test Mould',
//             scope: [],
//             input: {},
//             states: {
//                 default: {
//                     type: 'Stack',
//                     props: {},
//                 },
//             },
//         },
//     },
// }
export const initialData = (data as any) as EditorState

export const useIsSelectedMould = (mouldId: MouldID) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection || []
    )[0]

    return currentComponentPath[0] === mouldId
}

export const useIsSelectedState = (mouldId: MouldID, stateName: StateName) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection || []
    )[0]

    return (
        currentComponentPath[0] === mouldId &&
        currentComponentPath[1] === stateName
    )
}

export const useIsSelectedPath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        path !== undefined &&
        currentPath !== undefined &&
        [currentPath[0].join('/'), currentPath[1].join('/')].join('+') ===
            [path[0].join('/'), path[1].join('/')].join('+')
    )
}

export const useIsIncludePath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        path !== undefined &&
        currentPath !== undefined &&
        [currentPath[0].join('/'), currentPath[1].join('/')]
            .join('+')
            .includes([path[0].join('/'), path[1].join('/')].join('+'))
    )
}

export const rootTree = (props: ComponentProps, children: Component[]) => {
    return {
        type: 'Root',
        props,
        children,
    }
}

export const useCurrentMould = () => {
    const [selection, moulds] = useSelector((state: EditorState) => [
        state.selection,
        state.moulds,
    ])

    if (!selection) {
        return
    }

    return moulds[selection[0][0]]
}

export const useCurrentState = () => {
    const selection = useSelector((state: EditorState) => state.selection)

    if (!selection) {
        return
    }

    return selection[0][1]
}

export const pathToString = (path: Path) =>
    path[0].join('/') + '/' + path[1].join('-')
