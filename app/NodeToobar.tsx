import React, { useState } from 'react'
import Components from '../components'
import styled from 'styled-components'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { Server, Anchor } from 'react-feather'
import { useDispatch } from 'react-redux'
import { wrapChild, transfromNodeToKit } from './appShell'

const ToolbarWrapper = styled.div({
    position: 'absolute',
    minWidth: '160px',
    border: '1px solid #aaa',
    borderRadius: '3px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    fontSize: '20px',
    color: '#aaa',
    boxShadow: '1px 1px 5px #ddd',
    zIndex: 2,
})

const LeftShadow = styled.div({
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    height: '100%',
    backgroundColor: '#aaa',
})

const PopoverContent = ({ content }: { content: string }) => {
    return (
        <div
            style={{
                padding: 5,
            }}
        >
            {content}
        </div>
    )
}

const NodeToolbar = ({ type }: { type: string }) => {
    const dispatch = useDispatch()
    const [toolbarOffsetTop, setToolbarOffsetTop] = useState<number>(0)
    const plugin = Components.find((c) => c.type === type)
    if (!plugin) {
        return null
    }

    return (
        <ToolbarWrapper
            ref={(dom) => {
                if (dom?.nextElementSibling instanceof HTMLElement) {
                    const targetDOM = dom?.nextElementSibling
                    const [offsetTop, offsetLeft] = [
                        targetDOM.offsetTop + targetDOM.clientHeight + 10,
                        targetDOM.offsetLeft + 20,
                    ]
                    setToolbarOffsetTop(offsetTop)
                }
            }}
            style={{
                transform: `translate(20px,${toolbarOffsetTop}px)`,
            }}
        >
            <LeftShadow />
            <Popover
                interactionKind={PopoverInteractionKind.HOVER}
                autoFocus={false}
                content={
                    <PopoverContent content="Wrap in a Stack"></PopoverContent>
                }
            >
                <Server
                    onClick={() => {
                        dispatch(
                            wrapChild({
                                container: 'Stack',
                            })
                        )
                    }}
                    size={28}
                    color="#aaa"
                />
            </Popover>
            {plugin.type !== 'Kit' && (
                <Popover
                    interactionKind={PopoverInteractionKind.HOVER}
                    autoFocus={false}
                    content={
                        <PopoverContent content="Transform to a Kit"></PopoverContent>
                    }
                >
                    <Anchor
                        className="m-l"
                        onClick={() => {
                            dispatch(
                                transfromNodeToKit({
                                    type: plugin.type,
                                })
                            )
                        }}
                        size={28}
                        color="#aaa"
                    />
                </Popover>
            )}
        </ToolbarWrapper>
    )
}

export default NodeToolbar
