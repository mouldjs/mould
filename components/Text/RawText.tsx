import React, { SFC } from 'react'
import styled from 'styled-components'
import { TextProps } from '../../standard'

const mouseEventWrapper = (fn) => (event) =>
    fn ? fn(event.stopPropagation) : fn

export const RawText: SFC<TextProps & { ref: any }> = styled.span.attrs<
    TextProps
>((props) => ({
    children: props.content || 'Text',
    onClick: mouseEventWrapper(props.onClick),
    onClickCapture: mouseEventWrapper(props.onClickCapture),
}))<TextProps>`
    color: ${(props) => props.color};
    font-family: ${(props) => props.typeface};
    font-weight: ${(props) => props.weight};
    text-shadow: ${(props) => props.shadow};
    font-style: ${(props) => props.style};
    text-decoration-line: ${(props) => props.decorationLine};
    text-decoration-color: ${(props) => props.decorationColor};
    text-decoration-style: ${(props) => props.decorationStyle};
    text-decoration-thickness: ${(props) => props.decorationThickness};
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    overflow: ${(props) => props.overflow};
    opacity: ${(props) => parseFloat(props.opacity || '1')};
    border-radius: ${(props) => props.radius};
`
