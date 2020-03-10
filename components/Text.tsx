import React, { forwardRef } from 'react'
import { ComponentInspector } from '../app/Inspectors'
import { Input, Box } from '@modulz/radix'
import { BaseBox } from './BaseComponents'
import { CSSInspector } from './CSSInspector'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentPropTypes, ComponentProps } from '../app/types'

export default forwardRef(
    (
        {
            content = 'Text ...',
            requestUpdateProps,
            children,
            path,
            style,
            ...rest
        }: ComponentPropTypes & ComponentProps & { content: string },
        ref
    ) => {
        return (
            <BaseBox ref={ref} as="span" {...style} {...rest}>
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
                        style={style}
                        requestUpdateProps={requestUpdateProps}
                    ></CSSInspector>
                </ComponentInspector>
            </BaseBox>
        )
    }
)
