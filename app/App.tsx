import dynamic from 'next/dynamic'
import { Workspace } from './Workspaces'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers'
import reduceReducers from 'reduce-reducers'
import { RadixProvider, Flex, Box } from '@modulz/radix'
import 'normalize.css'
import { initialData } from './utils'
import { EditorState } from './types'
import './app.css'
import { useEffect } from 'react'
import { createProcessReducers, undo } from '../lib/undo-redux'
import { Toolbar } from './Toolbar'
import PropertyToolBar from './PropertyToolBar'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Explorer2 } from './Explorer'
import { cancelCreating, deleteNode } from './appShell'
import { TitledBoard } from '../inspector/FormComponents'
import { MouldMetas } from './MouldMetas'
import { MouldScope } from './MouldScope'
import { MouldKits } from './MouldKits'
import { ArcherContainer } from 'react-archer'
import { MouldInput } from './MouldInput'
import DebugPanel from './DebugPanel'

const KeyboardEventHandler: any = dynamic(
    () => import('react-keyboard-event-handler'),
    { ssr: false }
)

function handleTouchMove(e) {
    e.preventDefault()
}

const App = () => {
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
    const dispatch = useDispatch()
    const testWorkspace = useSelector((state: EditorState) => {
        return state.testWorkspace
    })
    const creating = useSelector((state: EditorState) => {
        return state.creating
    })
    const selection = useSelector((state: EditorState) => {
        return state.selection
    })
    const creatingStep = creating && creating[0]

    return (
        <Flex
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
            <KeyboardEventHandler
                handleKeys={['meta+z']}
                onKeyEvent={() => dispatch(undo())}
            ></KeyboardEventHandler>
            <Box width="100vw" height={50}>
                <Toolbar></Toolbar>
            </Box>

            <Flex
                flex={1}
                overflow="hidden"
                flexDirection="row"
                alignItems="stretch"
                alignContent="stretch"
                style={{
                    position: 'relative',
                }}
            >
                <Box
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
                        <TitledBoard title="Metas">
                            <MouldMetas></MouldMetas>
                            <MouldInput></MouldInput>
                        </TitledBoard>
                        <DebugPanel.Target></DebugPanel.Target>
                    </ArcherContainer>
                </Box>
                <Box
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
                    width={215}
                    style={{
                        transition: '0.3s',
                        position: 'absolute',
                        right: selection ? 0 : -215,
                        top: 0,
                        zIndex: 1,
                    }}
                    height="100vh"
                    borderLeft="1px solid #aaaaaa"
                    backgroundColor="#e1e1e1"
                >
                    <TitledBoard title="Hierarchy" collspae>
                        <Explorer2></Explorer2>
                    </TitledBoard>
                    <PropertyToolBar.Target />
                </Box>
            </Flex>
        </Flex>
    )
}

export default () => {
    const dev =
        typeof window !== 'undefined' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__

    return (
        <Provider
            store={
                dev
                    ? createStore(
                          reduceReducers(
                              initialData,
                              createProcessReducers<EditorState>()(
                                  ...reducers
                              ) as any
                          ),
                          (window as any).__REDUX_DEVTOOLS_EXTENSION__()
                      )
                    : createStore(
                          reduceReducers(
                              initialData,
                              createProcessReducers<EditorState>()(
                                  ...reducers
                              ) as any
                          )
                      )
            }
        >
            <DndProvider backend={HTML5Backend}>
                <RadixProvider>
                    <App></App>
                </RadixProvider>
            </DndProvider>
        </Provider>
    )
}
