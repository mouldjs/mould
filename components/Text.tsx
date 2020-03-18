import React, { forwardRef } from 'react'
import * as z from 'zod'
import { ComponentInspector } from '../app/Inspectors'
import { Input, Box } from '@modulz/radix'
import { BaseBox } from './BaseComponents'
import { CSSInspector } from './CSSInspector'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentPropTypes, zodComponentProps } from '../app/types'

export const textProps = z
    .object({
        content: z.string().optional(),
    })
    .merge(zodComponentProps)

type PropType = z.TypeOf<typeof textProps>

export default forwardRef(
    (
        {
            content = 'Text ...',
            requestUpdateProps,
            children,
            path,
            ...rest
        }: ComponentPropTypes & PropType,
        ref
    ) => {
        return (
            <BaseBox ref={ref} as="span" {...rest}>
                {content}
                <ComponentInspector path={path}>
                    <TitledBoard title="Text" collspae>
                        <Cell label="Content">
                            <Input
                                value={content}
                                placeholder="Input your content"
                                variant="fade"
                                onChange={e => {
                                    requestUpdateProps({
                                        content: e.target.value,
                                    })
                                }}
                            ></Input>
                        </Cell>
                    </TitledBoard>

                    <CSSInspector
                        style={rest}
                        requestUpdateProps={requestUpdateProps}
                    ></CSSInspector>
                </ComponentInspector>
            </BaseBox>
        )
    }
)
