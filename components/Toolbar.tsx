import React from 'react'
import { PlusSquare } from 'react-feather'
import { Box, Flex, GhostButton, Button } from '@modulz/radix'

export const Toolbar = () => {
    return (
        <Flex
            backgroundColor="#212121"
            alignItems="center"
            height="100%"
            paddingX={12}
        >
            <PlusSquare color="#fff"></PlusSquare>
        </Flex>
    )
}
