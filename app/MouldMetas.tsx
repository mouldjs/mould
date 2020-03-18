import React from 'react'
import { Input } from '@modulz/radix'
import { useCurrentMould } from './utils'
import { Cell } from '../inspector/FormComponents'

export const MouldMetas = () => {
    const mould = useCurrentMould()

    if (!mould) {
        return null
    }

    return (
        <>
            <Cell label="name">
                <Input value={mould.name}></Input>
            </Cell>
        </>
    )
}
