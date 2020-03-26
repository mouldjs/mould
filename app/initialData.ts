export default {
    testWorkspace: {
        id: '1234',
        x: 238,
        y: 87,
        views: ['u59pT4', 'BUSh07', 'mHQIeV', 'ZO_RVS', 'U9Dwt0', 'rESaot'],
    },
    views: {
        u59pT4: {
            id: 'u59pT4',
            mouldId: '9wOeWA',
            state: 'state 0',
            x: 379.486,
            y: 89.1428,
            width: 75,
            height: 33,
        },
        BUSh07: {
            id: 'BUSh07',
            mouldId: '9wOeWA',
            state: 'state 1',
            x: 528,
            y: 90,
            width: 53,
            height: 30,
        },
        mHQIeV: {
            id: 'mHQIeV',
            mouldId: 'JxFNOe',
            state: 'state 0',
            x: 369.333,
            y: 168,
            width: 393,
            height: 44,
        },
        ZO_RVS: {
            id: 'ZO_RVS',
            mouldId: 'YCD9aY',
            state: 'state 0',
            x: 363,
            y: 516,
            width: 397,
            height: 59,
        },
        U9Dwt0: {
            id: 'U9Dwt0',
            mouldId: 'YCD9aY',
            state: 'state 1',
            x: 363,
            y: 606,
            width: 394,
            height: 52,
        },
        rESaot: {
            id: 'rESaot',
            mouldId: 'uXreYU',
            state: 'state 0',
            x: 350.667,
            y: 717.333,
            width: 421,
            height: 410,
        },
    },
    moulds: {
        '9wOeWA': {
            id: '9wOeWA',
            name: 'mould 0',
            scope: ['label', 'onToggle'],
            kits: [
                {
                    type: 'Text',
                    name: 'kit 0',
                    dataMappingVector: [
                        ['content', 'label'],
                        ['onClick', 'onToggle'],
                    ],
                },
            ],
            input: ['label', 'onToggle', 'active'],
            states: {
                'state 0': [
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 0',
                            color: '',
                        },
                    },
                ],
                'state 1': [
                    {
                        type: 'Stack',
                        props: {
                            color: '',
                            verticalAlign: 'center',
                            horizontalAlign: 'center',
                            b: '',
                            bo: '',
                            bor: '',
                            bord: '',
                            borde: '',
                            border: '1px solid rgba(175, 47, 47, 0.2)',
                        },
                        children: [
                            {
                                type: 'Kit',
                                props: {
                                    __kitName: 'kit 0',
                                    color: '',
                                },
                            },
                        ],
                    },
                ],
            },
            rootProps: {
                color: '',
                horizontalAlign: 'center',
                verticalAlign: 'center',
                w: '',
                wi: '',
                wid: '',
                widt: '',
                width: '',
                h: '',
                he: '',
                hei: '',
                heig: '',
                heigh: '',
                height: '',
            },
            hookFunctionName: 'filterButton',
        },
        JxFNOe: {
            id: 'JxFNOe',
            name: 'mould 1',
            scope: [
                'activeAll',
                'onAll',
                'activeActive',
                'onActive',
                'activeCompleted',
                'onCompleted',
            ],
            kits: [
                {
                    type: 'Mould',
                    name: 'kit 0',
                    dataMappingVector: [
                        ['active', 'activeAll'],
                        ['onToggle', 'onAll'],
                    ],
                    param: {
                        mouldId: '9wOeWA',
                    },
                },
                {
                    type: 'Mould',
                    name: 'kit 1',
                    dataMappingVector: [
                        ['active', 'activeActive'],
                        ['onToggle', 'onActive'],
                    ],
                    param: {
                        mouldId: '9wOeWA',
                    },
                },
                {
                    type: 'Mould',
                    name: 'kit 2',
                    dataMappingVector: [
                        ['active', 'activeCompleted'],
                        ['onToggle', 'onCompleted'],
                    ],
                    param: {
                        mouldId: '9wOeWA',
                    },
                },
            ],
            input: ['active', 'onActive'],
            states: {
                'state 0': [
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 0',
                            label: 'All',
                        },
                    },
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 1',
                            label: 'Active',
                        },
                    },
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 2',
                            label: 'Completed',
                        },
                    },
                ],
            },
            rootProps: {
                color: '',
                direction: 'row',
                verticalAlign: 'space-between',
                h: '',
                he: '',
                hei: '',
                heig: '',
                heigh: '',
                height: '50px',
            },
            hookFunctionName: 'filter',
        },
        YCD9aY: {
            id: 'YCD9aY',
            name: 'mould 2',
            scope: ['text', 'onToggle'],
            kits: [
                {
                    type: 'Text',
                    name: 'kit 0',
                    dataMappingVector: [['content', 'text']],
                },
                {
                    type: 'Text',
                    name: 'kit 1',
                    dataMappingVector: [['onClick', 'onToggle']],
                },
            ],
            input: ['text', 'onToggle', 'completed'],
            states: {
                'state 0': [
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 1',
                            color: '',
                            content: '✅',
                        },
                    },
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 0',
                        },
                    },
                ],
                'state 1': [
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 1',
                            color: '',
                            content: '⭕️',
                        },
                    },
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 0',
                        },
                    },
                ],
            },
            rootProps: {
                color: '',
                horizontalAlign: 'center',
                verticalAlign: 'flex-start',
                direction: 'row',
            },
            hookFunctionName: 'todoItem',
        },
        uXreYU: {
            id: 'uXreYU',
            name: 'mould 3',
            scope: [
                'inputValue',
                'onInputChange',
                'todoText',
                'todoCompleted',
                'onToggleTodoComplete',
                'filterMode',
                'onChangeFilterMode',
                'onAddClick',
            ],
            kits: [
                {
                    type: 'Input',
                    name: 'kit 0',
                    dataMappingVector: [
                        ['value', 'inputValue'],
                        ['onChange', 'onInputChange'],
                    ],
                },
                {
                    type: 'Mould',
                    name: 'kit 1',
                    dataMappingVector: [
                        ['text', 'todoText'],
                        ['completed', 'todoCompleted'],
                        ['onToggle', 'onToggleTodoComplete'],
                    ],
                    param: {
                        mouldId: 'YCD9aY',
                    },
                    isList: true,
                },
                {
                    type: 'Mould',
                    name: 'kit 2',
                    dataMappingVector: [
                        ['active', 'filterMode'],
                        ['onActive', 'onChangeFilterMode'],
                    ],
                    param: {
                        mouldId: 'JxFNOe',
                    },
                },
                {
                    type: 'Text',
                    name: 'kit 3',
                    dataMappingVector: [['onClick', 'onAddClick']],
                },
            ],
            input: [],
            states: {
                'state 0': [
                    {
                        type: 'Stack',
                        props: {
                            color: '',
                            h: '',
                            he: '',
                            hei: '',
                            heig: '',
                            heigh: '',
                            height: '30px',
                            direction: 'row',
                        },
                        children: [
                            {
                                type: 'Kit',
                                props: {
                                    __kitName: 'kit 0',
                                    color: '',
                                },
                            },
                            {
                                type: 'Kit',
                                props: {
                                    __kitName: 'kit 3',
                                    color: 'blue',
                                    content: 'Add',
                                    m: '',
                                    ma: '',
                                    mar: '',
                                    marg: '',
                                    margi: '',
                                    margin: '',
                                    'margin-': '',
                                    marginL: '',
                                    marginLe: '',
                                    marginLef: '',
                                    marginLeft: '20px',
                                },
                            },
                        ],
                    },
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 1',
                            color: '',
                        },
                        children: [
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                            {
                                type: 'Mould',
                                props: {
                                    __mouldId: 'YCD9aY',
                                },
                            },
                        ],
                    },
                    {
                        type: 'Kit',
                        props: {
                            __kitName: 'kit 2',
                        },
                    },
                ],
            },
            rootProps: {
                color: '',
                p: '',
                pa: '',
                pad: '',
                padd: '',
                paddi: '',
                paddin: '',
                padding: '20px',
            },
            hookFunctionName: 'todoMVC',
        },
    },
    selection: [['uXreYU', 'state 0'], []],
}
