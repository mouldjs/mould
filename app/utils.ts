import { EditorState } from './types'

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
            views: ['a'],
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
            input: [],
            states: ['default'],
            tree: {
                path: '/Hello',
                props: {},
            },
        },
    },
}
