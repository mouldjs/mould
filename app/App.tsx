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
import { createProcessReducers } from '../lib/undo-redux'
import { Toolbar } from './Toolbar'
import PropertyToolBar from './PropertyToolBar'
import { DndProvider } from 'react-dnd-cjs'
import HTML5Backend from 'react-dnd-html5-backend-cjs'
import { Explorer } from './Explorer'
import { cancelCreating } from './appShell'

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
    const creatingStep = creating && creating[0]

    return (
        <Flex
            flexDirection="column"
            minHeight="100vh"
            alignItems="stretch"
            style={{ cursor: creatingStep ? 'crosshair' : 'unset' }}
            onMouseDown={() => {
                if (creatingStep) {
                    dispatch(cancelCreating())
                }
            }}
        >
            <Box width="100vw" height={50}>
                <Toolbar></Toolbar>
            </Box>
            <Flex
                flex={1}
                overflow="hidden"
                flexDirection="row"
                alignItems="stretch"
                alignContent="stretch"
            >
                <Box
                    width={215}
                    height="100vh"
                    borderRight="1px solid #aaaaaa"
                    backgroundColor="#e1e1e1"
                >
                    <Explorer></Explorer>
                </Box>
                <Box flex={1}>
                    <Workspace {...testWorkspace}></Workspace>
                </Box>
                <Box
                    width={215}
                    height="100vh"
                    borderLeft="1px solid #aaaaaa"
                    backgroundColor="#e1e1e1"
                >
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
                          reduceReducers(initialData, createProcessReducers<
                              EditorState
                          >()(...reducers) as any),
                          (window as any).__REDUX_DEVTOOLS_EXTENSION__()
                      )
                    : createStore(
                          reduceReducers(initialData, createProcessReducers<
                              EditorState
                          >()(...reducers) as any)
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
