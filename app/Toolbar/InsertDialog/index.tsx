import React, { useState } from 'react'
import styled from 'styled-components'
import { Drawer, Position } from '@blueprintjs/core'
import SearchBar from './SearchBar'
import ComponentsList from './ComponentsList'

const BodyWrapper = styled.div({
    height: '100vh',
})

// just list atomic component for layout
const icons = ['Stack', 'Frame', 'Text', 'Input', 'Icon']

export default ({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    const config = {
        autoFocus: false,
        canEscapeKeyClose: false,
        canOutsideClickClose: true,
        enforceFocus: false,
        usePortal: false,
        position: Position.LEFT,
        size: undefined,
        hasBackdrop: false,
        style: {
            width: '215px',
            height: '100%',
        },
    }

    const [inputValue, setInputValue] = useState('')
    const onInput = (value) => setInputValue(value)

    return (
        <Drawer isOpen={isOpen} onClose={onClose} {...config}>
            <BodyWrapper>
                <SearchBar onInput={onInput} />
                <ComponentsList inputValue={inputValue} />
            </BodyWrapper>
        </Drawer>
    )
}
