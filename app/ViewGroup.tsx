import React from 'react'
import { ViewGroup as ViewGroupType, EditorState } from './types'
import { Box, Text } from '@modulz/radix'
import { useSelector } from 'react-redux'
import Mould from '../components/Mould'

export const ViewGroup = ({ id }: { id: string }) => {
    const { x, y, name, views, active = 0, mouldId } = useSelector(
        (state: EditorState) => state.viewGroups[id]
    )
    const activeViewId = views[active]
    const activeView = useSelector(
        (state: EditorState) => state.views[activeViewId]
    )
    const mould = useSelector((state: EditorState) => state.moulds[mouldId])

    return (
        <Box
            boxShadow="0px 0px 5px #aaaaaa"
            position="absolute"
            left={x}
            top={y}
            width={activeView.width}
            height={activeView.height}
            bg="white"
        >
            <Box
                position="absolute"
                width={activeView.width}
                height={activeView.height}
                top={-20}
            >
                <Text truncate size={1} textColor="rgb(132,132,132)">
                    {name}
                </Text>
                <Mould editable {...mould}></Mould>
            </Box>
        </Box>
    )
}
