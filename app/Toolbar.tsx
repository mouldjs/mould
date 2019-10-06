import React from 'react'
import { PlusSquare, Layers, Image } from 'react-feather'
import { Box, Flex, GhostButton, Button } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'

const Icon = ({ name, children }) => {
    const [, drag] = useDrag({ item: { type: 'TREE', name } })

    return (
        <Box marginX={1} ref={drag}>
            {children}
        </Box>
    )
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
            <Icon name="Stack">
                <Layers color="#fff"></Layers>
            </Icon>
            <Icon name="Image">
                <Image color="#fff"></Image>
            </Icon>
        </Flex>
    )
}
