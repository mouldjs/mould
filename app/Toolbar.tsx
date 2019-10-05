import React from 'react'
import { PlusSquare } from 'react-feather'
import { Box, Flex, GhostButton, Button } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'

const Icon = ({ name, children }) => {
    const [, drag] = useDrag({ item: { type: 'TREE', name } })

    return <div ref={drag}>{children}</div>
}

export const Toolbar = () => {
    return (
        <Flex
            backgroundColor="#212121"
            alignItems="center"
            height="100%"
            paddingX={12}
        >
            <Icon name="Hello">
                <PlusSquare color="#fff"></PlusSquare>
            </Icon>
        </Flex>
    )
}
