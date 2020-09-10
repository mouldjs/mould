import React from 'react'
import styled from 'styled-components'

const Container = styled.div({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
})

const Mask = styled.div({
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    opacity: 0.4,
})

const Dialog = styled.div({
    position: 'relative',
    display: 'inline-block',
    width: '400px',
    height: '260px',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '3px',
    border: '1px solid #aaa',
    fontSize: '18px',
    color: '#999',
    boxShadow: '1px 1px 5px #ddd',
    zIndex: 1,
})

const Button = styled.button({
    position: 'absolute',
    bottom: '20px',
    display: 'block',
    left: ' 50%',
    transform: 'translate(-50%)',
    padding: '12px 20px',
    border: '1px solid #dcdfe6',
    backgroundColor: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    fontSize: '14px',
    zIndex: 1,
    '&:hover': {
        backgroundColor: '#eee',
    },
    '&:disabled': {
        cursor: 'not-allowed',
    },
})

const Tip = styled.p({
    fontSize: '14px',
})

const ErrorWrapper = styled.code({
    display: 'block',
    width: '100%',
    maxHeight: '100px',
    overflow: 'auto',
    fontSize: '12px',
    border: '1px solid red',
    padding: '5px',
})

export default ({
    onReady,
    error,
    loading,
}: {
    onReady: () => void
    error: any
    loading: boolean
}) => {
    return (
        <Container>
            <Mask />
            <Dialog>
                <p>Start Mould after local Mould was connected. </p>
                <Tip>
                    Tip: <code>'mould connect'</code> command in your repo.
                </Tip>
                {!!error && <ErrorWrapper>{error}</ErrorWrapper>}
                <Button disabled={loading} onClick={onReady}>
                    Start Mould
                </Button>
            </Dialog>
        </Container>
    )
}
