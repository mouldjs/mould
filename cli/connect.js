import { ApolloServer } from 'apollo-server-express'
import { schema } from '../apollo/schema'
import express from 'express'

const app = express()

const server = new ApolloServer({ schema })

server.applyMiddleware({ app, path: '/api/graphql' })

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
