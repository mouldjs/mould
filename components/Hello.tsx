import React from 'react'
import PropSource from '../app/PropSource'
import { Input } from '@modulz/radix'

export default ({ say = 'world', requestUpdateProps, children, path }) => {
    return (
        <div>
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
        </div>
    )
}
