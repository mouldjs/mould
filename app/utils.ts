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
            name: 'Test View Group',
            id: 'xxxxxx',
            x: 500,
            y: 200,
            views: { default: 'a' },
            mouldId: 'testMould',
        },
    },
    views: {
        a: {
            id: 'a',
            width: 300,
            height: 700,
        },
    },
    moulds: {
        testMould: {
            id: 'testMould',
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
        Array.isArray(currentPath) && currentPath.join('/') === path.join('/')
    )
}

export const useIsIncludePath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        Array.isArray(currentPath) &&
        currentPath.join('/').includes(path.join('/'))
    )
}
