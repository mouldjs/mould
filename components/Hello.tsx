import React from 'react'
import PropSource from './PropSource'
import { Input } from '@modulz/radix'

export default ({ say = 'world' }) => {
    return (
        <div>
            hello, {say}
            <PropSource>
                <Input
                    value={say}
                    placeholder="say?"
                    variant="fade"
                    onChange={e => {}}
                ></Input>
            </PropSource>
        </div>
    )
}
