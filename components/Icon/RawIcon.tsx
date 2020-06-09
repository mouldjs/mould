import React, { SFC, forwardRef } from 'react'
import styled from 'styled-components'
import { IconProps } from '../../standard'
import * as IconSet from 'react-feather'

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

const Container = styled.div.attrs<IconProps>((props) => ({
    onClick: mouseEventWrapper(props.onClick),
    onClickCapture: mouseEventWrapper(props.onClickCapture),
}))<IconProps>`
    display: flex;
    border-width: ${(props) => props.borderWidth};
    border-style: ${(props) => props.borderStyle};
    border-color: ${(props) => props.borderColor};
    background: ${(props) => props.fill};
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '100%'};
    overflow: ${(props) => props.overflow};
    opacity: ${(props) => parseFloat(props.opacity || '1')};
    border-radius: ${(props) => props.radius};
`

export const RawIcon: SFC<IconProps & { ref: any }> = forwardRef(
    (prop, ref) => {
        if (prop.name !== undefined) {
            const SelectedIcon: typeof IconSet.Activity = IconSet[prop.name]
            if (SelectedIcon) {
                return (
                    <Container {...(prop as any)} ref={ref}>
                        <SelectedIcon
                            color={prop.color}
                            size="100%"
                            filter={prop.filter}
                        ></SelectedIcon>
                    </Container>
                )
            } else {
                return null
            }
        }
        return null
    }
)
