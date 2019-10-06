import React from 'react'
import styled from 'styled-components'
import { system } from 'styled-system'
import { Flex, Box } from '@modulz/radix'

export const BaseFlex = styled(Flex)`
    ${system({
        outline: {
            property: 'outline',
            cssProperty: 'outline',
        },
    })}
`
export const BaseBox = styled(Box)`
    ${system({
        outline: {
            property: 'outline',
            cssProperty: 'outline',
        },
    })}
`
