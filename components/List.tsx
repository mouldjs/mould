import React, { forwardRef } from 'react'
import { ComponentInspector } from '../app/Inspectors'
import { Slider } from '@modulz/radix'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentPropTypes } from '../app/types'

export default forwardRef(
    (
        {
            requestUpdateProps,
            requestUpdateChildren,
            path,
            children,
        }: ComponentPropTypes,
        ref
    ) => {
        return (
            <>
                {children}
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        <TitledBoard title="List">
                            <Cell label="length">
                                <Slider
                                    value={children?.length}
                                    onChange={(e) => {
                                        requestUpdateChildren!((children) => {
                                            const nextLength =
                                                parseInt(e.target.value) || 1
                                            const added = new Array(
                                                nextLength
                                            ).fill({
                                                ...children![
                                                    children!.length - 1
                                                ],
                                            })
                                            const nextChildren = [
                                                ...children!,
                                                ...added,
                                            ].slice(0, nextLength)

                                            return nextChildren
                                        })
                                    }}
                                    max={20}
                                ></Slider>
                            </Cell>
                        </TitledBoard>
                    </ComponentInspector>
                )}
            </>
        )
    }
)
