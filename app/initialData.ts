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
            input: [],
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
    _processingChanges: [],
    _changes: [
        [
            {
                op: 'replace',
                path: ['moulds', 'DptLOn', 'states', 'state 0'],
                value: {
                    type: 'Stack',
                    props: {
                        color: '',
                    },
                },
            },
        ],
        [
            {
                op: 'replace',
                path: ['moulds', 'DptLOn', 'states', 'state 0'],
                value: {
                    type: 'Stack',
                    props: {},
                },
            },
        ],
        [
            {
                op: 'replace',
                path: ['views', 'jxkXWm', 'x'],
                value: 51,
            },
            {
                op: 'replace',
                path: ['views', 'jxkXWm', 'y'],
                value: 23,
            },
        ],
        [
            {
                op: 'add',
                path: ['selection'],
                value: [['DptLOn', 'state 0'], []],
            },
        ],
        [
            {
                op: 'replace',
                path: ['testWorkspace', 'views'],
                value: ['jxkXWm'],
            },
            {
                op: 'add',
                path: ['views', 'jxkXWm'],
                value: {
                    id: 'jxkXWm',
                    mouldId: 'DptLOn',
                    state: 'state 0',
                    x: 314,
                    y: 130,
                    width: 467,
                    height: 518,
                },
            },
            {
                op: 'add',
                path: ['moulds', 'DptLOn'],
                value: {
                    id: 'DptLOn',
                    name: 'mould 0',
                    scope: [],
                    kits: [],
                    input: [],
                    states: {
                        'state 0': null,
                    },
                },
            },
            {
                op: 'remove',
                path: ['creating'],
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 467,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 518,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 422,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 465,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 404,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 444,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 360,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 389,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 300,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 324,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 244,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 268,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 139,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 154,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 69,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 69,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 26,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 23,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 10,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 9,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 1,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 1,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'x'],
                value: 314,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'y'],
                value: 130,
            },
            {
                op: 'replace',
                path: ['creating', 'status'],
                value: 'updating',
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'status'],
                value: 'start',
            },
            {
                op: 'replace',
                path: ['creating', 'beginAt'],
                value: {
                    x: 314,
                    y: 130,
                },
            },
        ],
        [
            {
                op: 'add',
                path: ['creating'],
                value: {
                    status: 'waiting',
                    view: {
                        id: 'jxkXWm',
                        mouldId: 'DptLOn',
                        state: 'state 0',
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    },
                    beginAt: {
                        x: 0,
                        y: 0,
                    },
                },
            },
        ],
    ],
    _inverseChanges: [
        [
            {
                op: 'replace',
                path: ['moulds', 'DptLOn', 'states', 'state 0'],
                value: {
                    type: 'Stack',
                    props: {},
                },
            },
        ],
        [
            {
                op: 'replace',
                path: ['moulds', 'DptLOn', 'states', 'state 0'],
                value: null,
            },
        ],
        [
            {
                op: 'replace',
                path: ['views', 'jxkXWm', 'x'],
                value: 314,
            },
            {
                op: 'replace',
                path: ['views', 'jxkXWm', 'y'],
                value: 130,
            },
        ],
        [
            {
                op: 'remove',
                path: ['selection'],
            },
        ],
        [
            {
                op: 'replace',
                path: ['testWorkspace', 'views'],
                value: [],
            },
            {
                op: 'remove',
                path: ['views', 'jxkXWm'],
            },
            {
                op: 'remove',
                path: ['moulds', 'DptLOn'],
            },
            {
                op: 'add',
                path: ['creating'],
                value: {
                    status: 'updating',
                    view: {
                        id: 'jxkXWm',
                        mouldId: 'DptLOn',
                        state: 'state 0',
                        x: 314,
                        y: 130,
                        width: 467,
                        height: 518,
                    },
                    beginAt: {
                        x: 314,
                        y: 130,
                    },
                },
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 422,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 465,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 404,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 444,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 360,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 389,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 300,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 324,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 244,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 268,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 139,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 154,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 69,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 69,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 26,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 23,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 10,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 9,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 1,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 1,
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'view', 'width'],
                value: 0,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'height'],
                value: 0,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'x'],
                value: 0,
            },
            {
                op: 'replace',
                path: ['creating', 'view', 'y'],
                value: 0,
            },
            {
                op: 'replace',
                path: ['creating', 'status'],
                value: 'start',
            },
        ],
        [
            {
                op: 'replace',
                path: ['creating', 'status'],
                value: 'waiting',
            },
            {
                op: 'replace',
                path: ['creating', 'beginAt'],
                value: {
                    x: 0,
                    y: 0,
                },
            },
        ],
        [
            {
                op: 'remove',
                path: ['creating'],
            },
        ],
    ],
    selection: [['DptLOn', 'state 0'], []],
}
