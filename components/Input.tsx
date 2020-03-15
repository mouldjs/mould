import React, { forwardRef } from 'react'
import { ComponentInspector } from '../app/Inspectors'
import { Input } from '@modulz/radix'
import { BaseInput, BaseBox } from './BaseComponents'
import { CSSInspector } from './CSSInspector'
import { Cell, TitledBoard } from '../inspector/FormComponents'
import { ComponentPropTypes, ComponentProps } from '../app/types'

export default forwardRef(
    (
        {
            value = 'Input ...',
            placeholder = '',
            requestUpdateProps,
            children,
            path,
            style,
            ...rest
        }: ComponentPropTypes &
            ComponentProps & { value: string; placeholder: string },
        ref
    ) => {
        return (
            <>
                <BaseBox
                    as="input"
                    ref={ref}
                    value={value}
                    placeholder={placeholder}
                    {...style}
                    {...rest}
                ></BaseBox>
                <ComponentInspector path={path}>
                    <TitledBoard title="Text" collspae>
                        <Cell label="Value">
                            <Input
                                value={value}
                                placeholder="Input something"
                                variant="fade"
                                onChange={e => {
                                    requestUpdateProps({
                                        value: e.target.value,
                                    })
                                }}
                            ></Input>
                        </Cell>
                        <Cell label="Placeholder">
                            <Input
                                value={placeholder}
                                variant="fade"
                                onChange={e => {
                                    requestUpdateProps({
                                        placeholder: e.target.value,
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
            </>
        )
    }
)
