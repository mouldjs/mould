import { EditorState } from './types'

export default {
    testWorkspace: {
        id: '1234',
        x: 238,
        y: 87,
        views: ['jxkXWm'],
    },
    views: {
        jxkXWm: {
            id: 'jxkXWm',
            mouldId: 'DptLOn',
            state: 'state 0',
            x: 51,
            y: 23,
            width: 467,
            height: 518,
        },
    },
    moulds: {
        DptLOn: {
            id: 'DptLOn',
            name: 'mould 0',
            scope: [],
            kits: [],
            input: {},
            states: {
                'state 0': {
                    type: 'Stack',
                    props: {
                        color: '',
                    },
                },
            },
        },
    },
    selection: [['DptLOn', 'state 0'], []],
} as EditorState
