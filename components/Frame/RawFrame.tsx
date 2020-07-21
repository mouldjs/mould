import React, { SFC, RefForwardingComponent } from 'react'
import styled from 'styled-components'
import { StackProps } from '../../standard'
import * as z from 'zod'
import { FlexDirection } from '../../standard/stack'

const mouseEventWrapper = (fn) => (event) =>
    fn ? fn(event.stopPropagation) : fn

const flexDirectionToMarginSide = (
    direction: z.infer<typeof FlexDirection>
) => {
    switch (direction) {
        case 'column':
            return 'margin-bottom'
        case 'column-reverse':
            return 'margin-top'
        case 'row':
            return 'margin-right'
        case 'row-reverse':
            return 'margin-left'
    }
}

export const RawFrame: SFC<StackProps & { ref: any }> = styled.div.attrs<
    StackProps
>((props) => ({
    onClick: mouseEventWrapper(props.onClick),
    onClickCapture: mouseEventWrapper(props.onClickCapture),
}))<StackProps>`
    position: ${(props) => props.position};
    display: flex;
    flex-direction: ${(props) => props.flexDirection};
    justify-content: ${(props) => props.justifyContent};
    align-items: ${(props) => props.alignItem};
    box-shadow: ${(props) => props.shadow};
    filter: ${(props) => props.filter};
    border-width: ${(props) => props.borderWidth};
    border-style: ${(props) => props.borderStyle};
    border-color: ${(props) => props.borderColor};
    background: ${(props) => props.fill};
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '100%'};
    overflow: ${(props) => props.overflow};
    opacity: ${(props) => parseFloat(props.opacity || '1')};
    border-radius: ${(props) => props.radius};
    ${(props) => (props.padding ? `padding: ${props.padding}px;` : '')}
    ${(props) =>
        props.paddingTop ? `padding-top: ${props.paddingTop}px;` : ''}
    ${(props) =>
        props.paddingBottom ? `padding-bottom: ${props.paddingBottom}px;` : ''}
    ${(props) =>
        props.paddingLeft ? `padding-left: ${props.paddingLeft}px;` : ''}
    ${(props) =>
        props.paddingRight ? `padding-right: ${props.paddingRight}px;` : ''}
    flex-grow: ${(props) => props.flexGrow};
    flex-shrink: ${(props) => props.flexShrink};
    left: ${(props) => props.left};
    top: ${(props) => props.top};
    right: ${(props) => props.right};
    bottom: ${(props) => props.bottom};
`
