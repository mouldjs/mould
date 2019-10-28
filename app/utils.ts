import { EditorState, Path } from './types'
import { useSelector } from 'react-redux'

export const initialData: EditorState = {
    testWorkspace: {
        id: '1234',
        viewGroups: ['xxxxxx'],
        x: 0,
        y: 0,
    },
    viewGroups: {
        xxxxxx: {
            id: 'xxxxxx',
            x: 50,
            y: 100,
            views: { default: 'a' },
            mouldId: 'testMould',
        },
    },
    views: {
        a: {
            id: 'a',
            width: 300,
            height: 500,
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

export const useIsSelectedMould = (mouldId: string) => {
    const currentMouldId = useSelector((state: EditorState) => state.selection)

    return currentMouldId === mouldId
}

export const useIsSelectedPath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        path !== undefined &&
        Array.isArray(currentPath) &&
        currentPath.join('/') === path.join('/')
    )
}

export const useIsIncludePath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        Array.isArray(currentPath) &&
        currentPath.join('/').includes(path.join('/'))
    )
}
