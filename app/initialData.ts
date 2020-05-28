import { EditorState } from './types'

export default {
    testWorkspace: {
        id: '1234',
        x: 238,
        y: 87,
        views: ['jxkXWm', 'aaaaaa'],
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
        aaaaaa: {
            id: 'aaaaaa',
            mouldId: 'DptLOn',
            state: 'state 1',
            x: 551,
            y: 23,
            width: 90,
            height: 100,
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
                'state 1': {
                    type: 'Stack',
                    props: {
                        color: '',
                    },
                },
            },
        },
    },
    selection: [['DptLOn', 'state 0'], []],
    viewRelationsMap: {},
    connectingRelation: [
        { view: '', position: '' },
        { view: '', position: '' },
    ],
} as EditorState
