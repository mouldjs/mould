import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../../apollo/schema'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default new ApolloServer({ schema }).createHandler({
    path: '/api/graphql',
})
