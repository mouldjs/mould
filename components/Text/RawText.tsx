import React, { SFC } from 'react'
import styled from 'styled-components'
import { TextProps } from '../../standard'

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

export const RawText: SFC<TextProps & { ref: any }> = styled.div.attrs<
    TextProps
>((props) => ({
    children: props.content || 'Text',
    onClick: mouseEventWrapper(props.onClick),
    onClickCapture: mouseEventWrapper(props.onClickCapture),
}))<TextProps>`
    display: flex;
    color: ${(props) => props.color};
    font-weight: ${(props) => props.weight};
    text-shadow: ${(props) => props.shadow};
    font-style: ${(props) => props.fontStyle};
    font-size: ${(props) => props.size};
    letter-spacing: ${(props) => props.letterSpacing};
    line-height: ${(props) => props.lineHeight};
    justify-content: ${(props) => alignMapToFlex[props.horizontalAlign]};
    align-items: ${(props) => alignMapToFlex[props.verticalAlign]};
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    overflow: ${(props) => props.overflow};
    opacity: ${(props) => parseFloat(props.opacity || '1')};
    border-radius: ${(props) => props.radius};
    position: ${(props) => props.position};
    flex-grow: ${(props) => props.flexGrow};
    flex-shrink: ${(props) => props.flexShrink};
    left: ${(props) => props.left};
    top: ${(props) => props.top};
    right: ${(props) => props.right};
    bottom: ${(props) => props.bottom};
`
