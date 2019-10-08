import React from 'react'
import styled from 'styled-components'
import {
    system,
    compose,
    space,
    color,
    typography,
    layout,
    flexbox,
    background,
    border,
    position,
    shadow,
} from 'styled-system'

export const BaseFlex = styled.div`
    ${compose(
        system({
            outline: {
                property: 'outline',
                cssProperty: 'outline',
            },
        }),
        space,
        color,
        typography,
        layout,
        flexbox,
        background,
        border,
        position,
        shadow
    )}
    display: flex;
`

export const BaseBox = styled.div(
    compose(
        system({
            outline: {
                property: 'outline',
                cssProperty: 'outline',
            },
        }),
        space,
        color,
        typography,
        layout,
        flexbox,
        background,
        border,
        position,
        shadow
    )
)
