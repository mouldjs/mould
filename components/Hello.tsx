import React from 'react'
import { ComponentInspector } from '../app/Inspectors'
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
            <ComponentInspector path={path}>
                <Input
                    value={say}
                    placeholder="say?"
                    variant="fade"
                    onChange={e => {
                        requestUpdateProps({ say: e.target.value })
                    }}
                ></Input>
            </ComponentInspector>
        </Box>
    )
}
