import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers'
import reduceReducers from 'reduce-reducers'
import { initialData } from './utils'
import { createProcessReducers } from '../lib/undo-redux'
import { EditorState } from './types'
import { initApolloClient } from '../apollo/client'
import gql from 'graphql-tag'

const client = initApolloClient()

const saveSchemas = gql`
    mutation($schemas: String!) {
        saveSchemas(schemas: $schemas)
    }
`

const dev =
    typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__

const composeEnhancers =
    (dev && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

function logger({ getState }) {
    return (next) => (action) => {
        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action)

        client?.mutate({
            mutation: saveSchemas,
            variables: {
                schemas: JSON.stringify(getState()),
            },
        })

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue
    }
}

let store

export const getStore = (schemas) => {
    if (!store) {
        store = createStore(
            reduceReducers(
                schemas || initialData,
                createProcessReducers<EditorState>()(...reducers()) as any
            ),
            composeEnhancers(applyMiddleware(logger))
        )
    }

    return store
}
