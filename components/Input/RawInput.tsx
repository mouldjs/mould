import { SFC } from 'react'
import styled from 'styled-components'
import { InputProps } from './InputProps'

const mouseEventWrapper = (fn) => (event) =>
    fn ? fn(event.stopPropagation) : fn

const alignMapToFlex = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
}

export const RawInput: SFC<InputProps & { ref: any }> = styled.input.attrs<
    InputProps
>((props) => ({
    value: props.value || '',
    onClick: mouseEventWrapper(props.onClick),
    onClickCapture: mouseEventWrapper(props.onClickCapture),
    onChange: props.onChange,
    onChangeCapture: props.onChangeCapture,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
}))<InputProps>`
    display: flex;
    color: ${(props) => props.color};
    box-shadow: ${(props) => props.shadow};
    font-size: ${(props) => props.size};
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    overflow: ${(props) => props.overflow};
    opacity: ${(props) => parseFloat(props.opacity || '1')};
    border-radius: ${(props) => props.radius};
`
