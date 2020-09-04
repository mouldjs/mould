import gql from 'graphql-tag'

export const typeDefs = gql`
    type Query {
        schemas: String
        ping: Boolean
    }

    type Mutation {
        saveSchemas(schemas: String!): Boolean
    }
`
