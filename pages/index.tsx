import React from 'react'
import { withApollo } from '../apollo/client'
import App from '../app/App'

const Home = () => <App></App>

export default withApollo(Home)
