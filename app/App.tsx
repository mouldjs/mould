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
import { useEffect, useRef, useState } from 'react'
import { undo, redo } from '../lib/undo-redux'
import Toolbar from './Toolbar/index'
import PropertyToolBar from './PropertyToolBar'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Explorer2 } from './Explorer'
import { cancelCreating, deleteNode, waitingForCreating } from './appShell'
import { TitledBoard } from '../inspector/FormComponents'
import { MouldMetas } from './MouldMetas'
import { MouldScope } from './MouldScope'
import { MouldStates } from './MouldStates'
import { MouldKits } from './Kits/index'
import { ArcherContainer } from 'react-archer'
import { useWheel } from 'react-use-gesture'
import DebugPanel from './DebugPanel'
import nanoid from 'nanoid'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

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
    const mould = useSelector((state: EditorState) => {
        const [[mouldId]] = state.selection || [[]]

        return state.moulds[mouldId || -1]
    })

    const creatingStep = creating && creating.status

    return (
        <Flex
            translate
            flexDirection="column"
            bg="#f1f1f1"
            minHeight="100vh"
            alignItems="stretch"
            style={{ cursor: creatingStep ? 'crosshair' : 'unset' }}
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
                    dispatch(
                        waitingForCreating({
                            mouldId: nanoid(6),
                            stateName: 'state 0',
                        })
                    )
                }}
            />
            {/* hit s to easy add a new mould */}
            <KeyboardEventHandler
                handleKeys={['s']}
                onKeyEvent={() => {
                    mould &&
                        dispatch(
                            waitingForCreating({
                                mouldId: mould.id,
                                stateName: `state ${
                                    Object.keys(mould.states).length
                                }`,
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
            <div style={{ width: '100vw' }}>
                <Toolbar></Toolbar>
            </div>

            <Flex
                translate
                style={{
                    position: 'relative',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    alignContent: 'stretch',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Box
                    translate
                    width={215}
                    style={{
                        transition: '0.3s',
                        position: 'absolute',
                        left: selection ? 0 : -215,
                        top: 0,
                        zIndex: 1,
                    }}
                    height="100vh"
                    borderRight="1px solid #aaaaaa"
                    backgroundColor="#e1e1e1"
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
                    flex={1}
                    style={{
                        // zoom: selection ? 1 : 0.7,
                        transition: '0.3s',
                        // transform: selection ? 'scale(1)' : 'scale(0.75)',
                        overflow: 'visible',
                    }}
                >
                    <Workspace {...testWorkspace}></Workspace>
                </Box>
                <Box
                    translate
                    width={215}
                    style={{
                        transition: '0.3s',
                        position: 'absolute',
                        right: selection ? 0 : -215,
                        top: 0,
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
