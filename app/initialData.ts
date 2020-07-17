import { EditorState } from './types'

export default {
    testWorkspace: {
        id: '1234',
        x: 238,
        y: 87,
        views: ['jxkXWm'],
        zoom: 1,
    },
    views: {
        jxkXWm: {
            id: 'jxkXWm',
            mouldName: 'mould0',
            state: 'state0',
            x: 51,
            y: 23,
            width: 467,
            height: 518,
        },
    },
    moulds: [
        {
            name: 'mould0',
            scope: [],
            kits: [],
            input: {},
            states: {
                state0: {
                    type: 'Stack',
                    props: {
                        color: '',
                    },
                },
            },
        },
    ],
    selection: [['mould0', 'state0'], []],
    debugging: [['mould0', 'state0']],
} as EditorState
