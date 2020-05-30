import gql from 'graphql-tag'

export const typeDefs = gql`
    type Query {
        schemas: String
    }

    type Mutation {
        saveSchemas(schemas: String!): Boolean
    }
`
