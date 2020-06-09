import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@/app/style/blueprint.scss'
// import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@/app/style/App.scss'
import dynamic from 'next/dynamic'
import CustomDragLayer from './CustomDragLayer'
import { Workspace } from './Workspaces'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { getStore } from './store'
import { RadixProvider, Flex, Box } from '@modulz/radix'
import { EditorState } from './types'
import { useEffect, useRef, useState, Fragment } from 'react'
import { undo, redo } from '../lib/undo-redux'
import Toolbar from './Toolbar/index'
import PropertyToolBar from './PropertyToolBar'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Explorer2 } from './Explorer'
import {
    cancelCreating,
    deleteNode,
    waitingForCreating,
    zoomWorkspace,
    duplicateView,
} from './appShell'
import { TitledBoard } from '../inspector/FormComponents'
import { MouldMetas } from './MouldMetas'
import { MouldScope } from './MouldScope'
import { MouldStates } from './MouldStates'
import { MouldKits } from './Kits/index'
import { ArcherContainer } from 'react-archer'
import { useWheel } from 'react-use-gesture'
import DebugPanel from './DebugPanel'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { useCurrentMould, useCurrentView, initialData } from './utils'
import { debounce } from 'lodash'

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
    const HierarchyBlockRef = useRef<HTMLDivElement>(null)
    const InspectorsBlockRef = useRef<HTMLDivElement>(null)
    const [hierarchyBlockHeight, setHierarchyBlockHeight] = useState(50)

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

    const bind = useWheel(
        ({ event, delta: [, dy] }) => {
            if (InspectorsBlockRef && InspectorsBlockRef.current) {
                InspectorsBlockRef.current.scrollTop += dy
            }

            event && event.stopPropagation()
        },
        {
            domTarget: InspectorsBlockRef,
        }
    )

    useEffect(() => {
        if (HierarchyBlockRef.current) {
            setHierarchyBlockHeight(HierarchyBlockRef.current.clientHeight)
        }
    })
    useEffect(bind, [bind])

    const dispatch = useDispatch()
    const { testWorkspace, creating, selection } = useSelector(
        (state: EditorState) => state
    )
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
                    zoomIn(0.25, testWorkspace.zoom)
                }}
            ></KeyboardEventHandler>
            <KeyboardEventHandler
                handleKeys={['ctrl+minus']}
                onKeyEvent={() => {
                    zoomOut(0.25, testWorkspace.zoom)
                }}
            ></KeyboardEventHandler>
            <KeyboardEventHandler
                handleKeys={['ctrl+d']}
                onKeyEvent={debounce(() => {
                    currentView &&
                        dispatch(duplicateView({ viewId: currentView.id }))
                }, 300)}
            ></KeyboardEventHandler>
            <Toolbar></Toolbar>
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
                <Box
                    translate
                    style={{
                        transition: '0.3s',
                        position: 'absolute',
                        left: selection ? 0 : -215,
                        top: '55px',
                        height: 'calc(100vh - 55px)',
                        width: '215px',
                        zIndex: 1,
                        borderRight: '1px solid #aaaaaa',
                        backgroundColor: '#e1e1e1',
                    }}
                >
                    <ArcherContainer
                        style={{
                            height: '100%',
                            backgroundColor: '#e1e1e1',
                        }}
                        svgContainerStyle={{
                            overflow: 'visible',
                            pointerEvents: 'none',
                            zIndex: -1,
                        }}
                        strokeColor="red"
                        arrowLength={0}
                        strokeWidth={1}
                    >
                        <MouldScope></MouldScope>
                        <TitledBoard title="Kits">
                            <MouldKits></MouldKits>
                        </TitledBoard>
                        <MouldMetas></MouldMetas>
                        <DebugPanel.Target></DebugPanel.Target>
                    </ArcherContainer>
                </Box>
                <Box
                    translate
                    width={215}
                    style={{
                        transition: '0.3s',
                        position: 'absolute',
                        right: selection ? 0 : -215,
                        top: '55px',
                        zIndex: 1,
                        height: 'calc(100vh - 55px)',
                        borderLeft: '1px solid #aaa',
                        backgroundColor: '#e1e1e1',
                    }}
                >
                    <MouldStates></MouldStates>
                    <div ref={HierarchyBlockRef}>
                        <TitledBoard title="Hierarchy">
                            <Explorer2></Explorer2>
                        </TitledBoard>
                    </div>
                    <div
                        ref={InspectorsBlockRef}
                        style={{
                            position: 'absolute',
                            height: `calc(100% - ${hierarchyBlockHeight}px)`,
                            overflowY: 'auto',
                        }}
                    >
                        <PropertyToolBar.Target />
                    </div>
                </Box>
            </Flex>
            <div style={{ overflow: 'visible' }}>
                <Workspace {...testWorkspace}></Workspace>
            </div>
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
