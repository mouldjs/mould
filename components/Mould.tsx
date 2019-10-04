import React from 'react'
import dynamic from 'next/dynamic'
import { Mould } from '../app/types'
import MouldContext from './MouldContext'

const { Provider } = MouldContext

type Editable = { editable: boolean }

export default ({ tree, editable = false }: Mould & Editable) => {
    const { path, props, children } = tree
    const Comp = dynamic(() => import(`../components${path}`))

    return (
        <Provider value={editable}>
            <Comp {...props}>{children}</Comp>
        </Provider>
    )
}
