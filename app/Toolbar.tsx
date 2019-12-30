import React from 'react'
import { PlusSquare, Layers, Image, Pocket } from 'react-feather'
import { Box, Flex, GhostButton, Button } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'
import { useDispatch, useSelector } from 'react-redux'
import { addMould } from './appShell'
import { EditorState } from './types'

const Icon = ({ name, children }) => {
    const [, drag] = useDrag({ item: { type: 'TREE', name } })

    return (
        <Box marginX={1} ref={drag}>
            {children}
        </Box>
    )
}

const AddMould = () => {
    const dispatch = useDispatch()
    const viewsLength = useSelector((state: EditorState) => {
        return Object.values(state.views).length
    })

    return (
        <Pocket
            color="#fff"
            onClick={() =>
                dispatch(
                    addMould({
                        x: 50,
                        y: 100 + (100 + 500 + 70) * viewsLength,
                        width: 300,
                        height: 500,
                    })
                )
            }
        ></Pocket>
    )
}

export const Toolbar = () => {
    return (
        <Flex
            backgroundColor="#212121"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
            paddingX={12}
        >
            <Flex>
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
            <AddMould></AddMould>
        </Flex>
    )
}
