import styled from 'styled-components'
import { Dialog } from '@blueprintjs/core'
import SearchBar from './SearchBar'
import ComponentsList from './ComponentsList'
import InfoBlock from './InfoBlock'
import { useState } from 'react'

const Body = styled.div({
    display: 'flex',
    height: '100%',
    flexGrow: 1,
})

const BodyWrapper = styled.div({
    height: 'calc(100% - 50px)',
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
        usePortal: true,
        style: {
            maxWidth: 'calc(100vw - 200px)',
            maxHeight: 'calc(100vh - 200px)',
            minWidth: '680px',
            minHeight: '480px',
            height: '480px',
            paddingBottom: 0,
        },
    }

    const [currentItem, setCurrentItem] = useState('')
    const [inputValue, setInputValue] = useState('')
    const onItemSelect = (itemName) => setCurrentItem(itemName)
    const onInput = (value) => setInputValue(value)
    const clearSelected = () => setCurrentItem('')

    return (
        <Dialog isOpen={isOpen} onClose={onClose} {...config}>
            <BodyWrapper>
                <SearchBar onInput={onInput} clearSelected={clearSelected} />
                <Body>
                    <ComponentsList
                        inputValue={inputValue}
                        onItemSelect={onItemSelect}
                        currentItem={currentItem}
                    />
                    <InfoBlock onClose={onClose} currentItem={currentItem} />
                </Body>
            </BodyWrapper>
        </Dialog>
    )
}
