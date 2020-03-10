export default {
    testWorkspace: {
        id: '1234',
        x: 238,
        y: 87,
        views: ['a', 'C02u46', 'EhAr-c', 'Hr8hdg', '1I-4cH'],
    },
    views: {
        a: {
            id: 'a',
            mouldId: 'testMould',
            state: 'default',
            width: 300,
            height: 132,
            x: -74,
            y: -57,
        },
        C02u46: {
            id: 'C02u46',
            mouldId: 'wqmwUI',
            state: 'state 0',
            x: -71,
            y: 125,
            width: 60,
            height: 51,
        },
        'EhAr-c': {
            id: 'EhAr-c',
            mouldId: 'wqmwUI',
            state: 'state 1',
            x: -2,
            y: 126,
            width: 48,
            height: 38,
        },
        Hr8hdg: {
            id: 'Hr8hdg',
            mouldId: '16mDaN',
            state: 'state 0',
            x: -98,
            y: 218,
            width: 498,
            height: 55,
        },
        '1I-4cH': {
            id: '1I-4cH',
            mouldId: 'Aeoilr',
            state: 'state 0',
            x: 105,
            y: 127,
            width: 179,
            height: 45,
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
                    props: {
                        style: {
                            background: '',
                        },
                    },
                    children: [
                        {
                            type: 'Text',
                            props: {
                                style: {
                                    background: '',
                                    width: '100%',
                                    textAlign: 'center',
                                    height: '100px',
                                    lineHeight: '100px',
                                    fontSize: '100px',
                                    fontWeight: '100',
                                    color: 'rgba(175, 47, 47, 0.15)',
                                    fontFamily:
                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                },
                                content: 'todos',
                            },
                        },
                    ],
                },
            },
        },
        wqmwUI: {
            id: 'wqmwUI',
            name: 'mould 1',
            scope: [],
            input: {},
            states: {
                'state 0': {
                    type: 'Stack',
                    props: {
                        style: {
                            background: '',
                            width: 'auto',
                            height: '20px',
                            margin: 'auto',
                        },
                        verticalAlign: 'center',
                        horizontalAlign: 'center',
                        direction: 'column',
                    },
                    children: [
                        {
                            type: 'Stack',
                            props: {
                                style: {
                                    background: '',
                                    border: '1px solid rgba(175, 47, 47, 0.2)',
                                    height: '20px',
                                    width: 'auto',
                                    borderRadius: '3px',
                                    padding: '3px 7px',
                                    margin: 'auto',
                                },
                                verticalAlign: 'center',
                                horizontalAlign: 'center',
                                direction: 'column',
                            },
                            children: [
                                {
                                    type: 'Text',
                                    props: {
                                        style: {
                                            background: '',
                                        },
                                        content: 'All',
                                    },
                                },
                            ],
                        },
                    ],
                },
                'state 1': {
                    type: 'Stack',
                    props: {
                        style: {
                            background: '',
                        },
                        verticalAlign: 'center',
                        horizontalAlign: 'center',
                    },
                    children: [
                        {
                            type: 'Text',
                            props: {
                                style: {
                                    background: '',
                                },
                                content: 'All',
                            },
                        },
                    ],
                },
            },
        },
        '16mDaN': {
            id: '16mDaN',
            name: 'mould 2',
            scope: [],
            input: {},
            states: {
                'state 0': {
                    type: 'Stack',
                    props: {
                        style: {
                            background: '',
                            boxShadow:
                                '0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2)',
                            padding: '10px 15px',
                            color: '#777',
                        },
                        direction: 'row',
                        horizontalAlign: 'space-between',
                    },
                    children: [
                        {
                            type: 'Stack',
                            props: {
                                style: {
                                    background: '',
                                    boxShadow: '',
                                },
                                verticalAlign: 'space-between',
                                direction: 'row',
                                horizontalAlign: 'center',
                            },
                            children: [
                                {
                                    type: 'Text',
                                    props: {
                                        style: {
                                            background: '',
                                        },
                                        content: '1 item left',
                                    },
                                },
                            ],
                        },
                        {
                            type: 'Mould',
                            props: {
                                mouldId: 'Aeoilr',
                            },
                        },
                        {
                            type: 'Stack',
                            props: {},
                        },
                    ],
                },
            },
        },
        Aeoilr: {
            id: 'Aeoilr',
            name: 'mould 3',
            scope: [],
            input: {},
            states: {
                'state 0': {
                    type: 'Stack',
                    props: {
                        style: {
                            background: '',
                            padding: '7px',
                        },
                        direction: 'row',
                        verticalAlign: 'space-between',
                        horizontalAlign: 'center',
                    },
                    children: [
                        {
                            type: 'Mould',
                            props: {
                                mouldId: 'wqmwUI',
                            },
                        },
                        {
                            type: 'Mould',
                            props: {
                                mouldId: 'wqmwUI',
                            },
                        },
                        {
                            type: 'Mould',
                            props: {
                                mouldId: 'wqmwUI',
                            },
                        },
                    ],
                },
            },
        },
    },
}
