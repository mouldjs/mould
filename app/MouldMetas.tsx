import React from 'react'
import { Input } from '@modulz/radix'
import { useCurrentMould } from './utils'
import { Cell } from '../inspector/FormComponents'
import { useDispatch } from 'react-redux'
import { modifyMeta } from './appShell'

export const MouldMetas = () => {
    const dispatch = useDispatch()
    const mould = useCurrentMould()

    if (!mould) {
        return null
    }

    return (
        <>
            <Cell label="name">
                <Input
                    key={mould.id}
                    value={mould.name}
                    onChange={(e) => {
                        dispatch(
                            modifyMeta({
                                mouldId: mould.id,
                                name: e.target.value,
                            })
                        )
                    }}
                ></Input>
            </Cell>
            <Cell label="function">
                <Input
                    key={mould.id}
                    value={mould.hookFunctionName}
                    onChange={(e) => {
                        dispatch(
                            modifyMeta({
                                mouldId: mould.id,
                                hookFunctionName: e.target.value,
                            })
                        )
                    }}
                ></Input>
            </Cell>
        </>
    )
}
