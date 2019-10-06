import React from 'react'
import PropSource from '../app/PropSource'
import { Input, Box } from '@modulz/radix'

export default ({
    say = 'world',
    requestUpdateProps,
    children,
    path,
    ...rest
}) => {
    return (
        <Box {...rest}>
            hello, {say}
            {children}
            <PropSource path={path}>
                <Input
                    value={say}
                    placeholder="say?"
                    variant="fade"
                    onChange={e => {
                        requestUpdateProps({ say: e.target.value })
                    }}
                ></Input>
            </PropSource>
        </Box>
    )
}
