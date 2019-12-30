import { EditorState, Path, StateName, MouldID } from './types'
import { useSelector } from 'react-redux'

export const initialData: EditorState = {
    testWorkspace: {
        id: '1234',
        x: 0,
        y: 0,
        views: ['a'],
    },
    views: {
        a: {
            id: 'a',
            mouldId: 'testMould',
            state: 'default',
            width: 300,
            height: 500,
            x: 100,
            y: 100,
        },
    },
    moulds: {
        testMould: {
            id: 'testMould',
            name: 'Test Mould',
            scope: [],
            input: {},
            states: {
                default: {
                    type: 'Stack',
                    props: {},
                },
            },
        },
    },
}

export const useIsSelectedMould = (mouldId: MouldID) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection
    )[0]

    return currentComponentPath[0] === mouldId
}

export const useIsSelectedState = (mouldId: MouldID, stateName: StateName) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection
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
