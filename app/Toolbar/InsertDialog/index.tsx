import styled from 'styled-components'
import { Dialog } from '@blueprintjs/core'
import SearchBar from './SearchBar'
import ComponentsList from './ComponentsList'
import InfoBlock from './InfoBlock'

const Body = styled.div({
    display: 'flex',
    height: '100%',
    flexGrow: 1,
})

export default ({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    const config = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
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

    return (
        <Dialog isOpen={isOpen} onClose={onClose} {...config}>
            <SearchBar />
            <Body>
                <ComponentsList />
                <InfoBlock />
            </Body>
        </Dialog>
    )
}
