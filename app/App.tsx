import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@/app/style/blueprint.scss'
// import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@/app/style/App.scss'
import React from 'react'
import dynamic from 'next/dynamic'
import CustomDragLayer from './CustomDragLayer'
import { Workspace } from './Workspaces'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { getStore } from './store'
import { RadixProvider, Flex, Box } from '@modulz/radix'
import { EditorState } from './types'
import { useEffect, useRef, useState } from 'react'
import { undo, redo } from '../lib/undo-redux'
import Toolbar from './Toolbar/index'
import PropertyToolBar from './PropertyToolBar'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {
    cancelCreating,
    deleteNode,
    waitingForCreating,
    zoomWorkspace,
    duplicateView,
    pauseDebugging,
    updateDebugging,
} from './appShell'
import { MouldStates } from './MouldStates'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import {
    useCurrentMould,
    useCurrentView,
    initialData,
    useSimulateScroll,
} from './utils'
import { debounce } from 'lodash'
import LeftMenu from './Aside/LeftMenu'
import RightMenu from './Aside/RightMenu'

const schemaQuery = gql`
    query {
        schemas
    }
`

const KeyboardEventHandler: any = dynamic(
    () => import('react-keyboard-event-handler'),
    { ssr: false }
)

function handleTouchMove(e) {
    e.preventDefault()
}

const App = () => {
    const InspectorsBlockRef = useRef<HTMLDivElement>(null)
    const headerHeight = 50
    useEffect(() => {
        //阻止二指滑动的默认浏览器 后退/前进 行为
        if (document) {
            document.addEventListener('wheel', handleTouchMove, {
                passive: false,
            })

            return () => {
                document.removeEventListener('wheel', handleTouchMove)
            }
        }
    }, [])

    useSimulateScroll(InspectorsBlockRef)

    const dispatch = useDispatch()
    const creating = useSelector((state: EditorState) => state.creating)
    const hasSelection = useSelector((state: EditorState) => !!state.selection)
    const debugging = useSelector((state: EditorState) => state.debugging)
    const zoom = useSelector((state: EditorState) => state.testWorkspace.zoom)
    const mould = useCurrentMould()
    const currentView = useCurrentView()
    const creatingStep = creating && creating.status

    const zoomOut = (step, zoom) => {
        const result = zoom - step <= 0 ? 0.01 : zoom - step
        dispatch(zoomWorkspace({ zoom: result }))
    }

    const zoomIn = (step, zoom) => {
        const result = zoom + step >= 5 ? zoom : zoom + step
        dispatch(zoomWorkspace({ zoom: result }))
    }

    const [inputValue, setInputValue] = useState('')
    const onInput = (value) => setInputValue(value)

    return (
        <Flex
            translate
            position="absolute"
            flexDirection="column"
            bg="#f1f1f1"
            minHeight="100vh"
            alignItems="stretch"
            className={`${creatingStep ? 'draggable' : 'cursor-unset'}`}
            onMouseDown={() => {
                if (creatingStep) {
                    dispatch(cancelCreating())
                }
            }}
        >
            <KeyboardEventHandler
                handleKeys={['ctrl+e']}
                onKeyEvent={() => {
                    if (debugging[0]) {
                        dispatch(pauseDebugging())
                    } else {
                        if (currentView) {
                            dispatch(
                                updateDebugging({
                                    mouldName: currentView.mouldName,
                                    stateName: currentView.state,
                                })
                            )
                        }
                    }
                }}
            />
            <KeyboardEventHandler
                handleKeys={['backspace', 'del']}
                onKeyEvent={() => {
                    dispatch(deleteNode())
                }}
            />
            {/* hit m to easy add a new mould */}
            <KeyboardEventHandler
                handleKeys={['m']}
                onKeyEvent={() => {
                    dispatch(waitingForCreating({}))
                }}
            />
            {/* hit s to easy add a new mould */}
            <KeyboardEventHandler
                handleKeys={['s']}
                onKeyEvent={() => {
                    mould &&
                        dispatch(
                            waitingForCreating({
                                mouldName: mould.name,
                            })
                        )
                }}
            />
            <KeyboardEventHandler
                handleKeys={['meta+z']}
                onKeyEvent={() => dispatch(undo())}
            ></KeyboardEventHandler>
            <KeyboardEventHandler
                handleKeys={['shift+meta+z']}
                onKeyEvent={() => dispatch(redo())}
            ></KeyboardEventHandler>
            <KeyboardEventHandler
                handleKeys={['ctrl+plus']}
                onKeyEvent={() => {
                    zoomIn(0.25, zoom)
                }}
            ></KeyboardEventHandler>
            <KeyboardEventHandler
                handleKeys={['ctrl+minus']}
                onKeyEvent={() => {
                    zoomOut(0.25, zoom)
                }}
            ></KeyboardEventHandler>
            <KeyboardEventHandler
                handleKeys={['ctrl+d']}
                onKeyEvent={debounce(() => {
                    currentView &&
                        dispatch(duplicateView({ viewId: currentView.id }))
                }, 300)}
            ></KeyboardEventHandler>
            <Toolbar height={headerHeight} />

            <Flex
                translate
                style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    alignContent: 'stretch',
                    flex: 1,
                    overflow: 'hidden',
                    width: '100vw',
                    height: '100%',
                }}
            >
                <LeftMenu headerHeight={headerHeight} />
                <RightMenu headerHeight={headerHeight} />

                {/* <Box
                    translate
                    width={215}
                    style={{
                        transition: '0.3s',
                        position: 'absolute',
                        right: hasSelection ? 0 : -215,
                        top: `${headerHeight}px`,
                        height: `calc(100vh - ${headerHeight}px)`,
                        zIndex: 1,
                        borderLeft: '1px solid #aaa',
                        backgroundColor: '#e1e1e1',
                    }}
                >
                    <MouldStates></MouldStates>
                    <div
                        ref={InspectorsBlockRef}
                        style={{
                            width: '100%',
                            position: 'absolute',
                            height: '100%',
                            overflowY: 'auto',
                        }}
                    >
                        <PropertyToolBar.Target />
                    </div>
                </Box> */}
            </Flex>
            <Workspace></Workspace>
        </Flex>
    )
}

export default () => {
    const { data, loading, error } = useQuery(schemaQuery)

    if (loading) {
        return null
    }

    if (error) {
        return <div>{error}</div>
    }

    const dataObj = data.schemas ? JSON.parse(data.schemas) : null

    return (
        <Provider store={getStore(dataObj)}>
            <DndProvider backend={HTML5Backend}>
                <CustomDragLayer></CustomDragLayer>
                <RadixProvider>
                    <App></App>
                </RadixProvider>
            </DndProvider>
        </Provider>
    )
}
