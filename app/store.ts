import { createStore } from 'redux'
import reducers from './reducers'
import reduceReducers from 'reduce-reducers'
import { initialData } from './utils'
import { createProcessReducers } from '../lib/undo-redux'
import { EditorState } from './types'

const dev =
    typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__

let store

export const getStore = () => {
    if (!store) {
        store = dev
            ? createStore(
                  reduceReducers(
                      initialData,
                      createProcessReducers<EditorState>()(...reducers()) as any
                  ),
                  (window as any).__REDUX_DEVTOOLS_EXTENSION__()
              )
            : createStore(
                  reduceReducers(
                      initialData,
                      createProcessReducers<EditorState>()(...reducers()) as any
                  )
              )
    }

    return store
}
