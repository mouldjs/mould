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
    placeholder: props.placeholder || '',
    onClick: mouseEventWrapper(props.onClick),
    onClickCapture: mouseEventWrapper(props.onClickCapture),
    onChange: props.onChange,
    onChangeCapture: props.onChangeCapture,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
}))<InputProps>`
    display: flex;
    border: none;
    outline: none;
    -webkit-appearance: none;
    color: ${(props) => props.color};
    box-shadow: ${(props) => props.shadow};
    font-size: ${(props) => props.size};
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    border-width: ${(props) => props.borderWidth};
    border-style: ${(props) => props.borderStyle};
    border-color: ${(props) => props.borderColor};
    background: ${(props) => props.fill};
    overflow: ${(props) => props.overflow};
    opacity: ${(props) => parseFloat(props.opacity || '1')};
    border-radius: ${(props) => props.radius};
`
