import React from 'react'
import { View as ViewType, EditorState } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { useIsSelectedMould, useIsSelectedState } from './utils'
import { ResizableBox } from 'react-resizable'
import { resizeView } from './appShell'
import { Box, Text } from '@modulz/radix'
import Mould from './Mould'

export const View = ({ viewId }: { viewId: string }) => {
    const { mouldId, state, x, y, width, height } = useSelector(
        (state: EditorState) => state.views[viewId]
    )
    const mould = useSelector((state: EditorState) => state.moulds[mouldId])
    // const dispatch = useDispatch()
    // const isSelectedState = useIsSelectedState(mouldId, state)
    // const isSelectedMould = useIsSelectedMould(mouldId)

    // return      <ResizableBox
    //     width={width}
    //     height={height}
    //     onResize={(e, { size: { width, height } }) => {
    //         dispatch(
    //             resizeView({
    //                 viewId,
    //                 width,
    //                 height,
    //             })
    //         )
    //     }}
    // >
    return (
        <Box
            boxShadow="0px 0px 5px #aaaaaa"
            position="absolute"
            width={width}
            height={height}
            bg="white"
            left={x}
            top={y}
        >
            <Box position="absolute" top={-20}>
                <Text truncate size={1} textColor="rgb(132,132,132)">
                    {state}
                </Text>
            </Box>
            <Mould editable {...mould} currentState={state}></Mould>
        </Box>
    )
    // </ResizableBox>
}
