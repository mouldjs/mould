import styled from 'styled-components'
import { Search } from 'react-feather'

const Container = styled.div({
    display: 'flex',
    background: '#fff',
    height: '50px',
    width: '100%',
    borderBottom: '1px solid #aaa',
    borderRadius: '4px 4px 0 0',
    alignItems: 'center',
    paddingLeft: '10px',
    paddingRight: '10px',
})

const Input = styled.input({
    width: '100%',
    height: '100%',
    border: 'none',
    fontSize: '14px',
    paddingLeft: '5px',
    letterSpacing: 1.2,
})

export default ({
    onInput,
    clearSelected,
}: {
    onInput: (value: string) => void
    clearSelected: () => void
}) => {
    return (
        <>
            <Container>
                <Search size="18" />
                <Input
                    onChange={(e) => {
                        onInput(e.target.value)
                        clearSelected()
                    }}
                    placeholder="Find components..."
                />
            </Container>
        </>
    )
}
