import React, { Fragment, forwardRef } from 'react'
import { ComponentInspector } from '../app/Inspectors'
import { Input } from '@modulz/radix'
import { BaseBox } from './BaseComponents'
import { GeneralStyleInspector } from './GeneralStyleInspector'
import * as z from 'zod'
import { ComponentPropTypes, zodComponentProps } from '../app/types'

export const imageProps = z
    .object({
        src: z.string().optional(),
    })
    .merge(zodComponentProps)

type PropType = z.TypeOf<typeof imageProps>

export default forwardRef(
    (
        {
            src = 'http://wanzao2.baozoumanhua.com/system/series/icons/7112/original/1-1.jpg-s1',
            requestUpdateProps,
            path,
            ...rest
        }: ComponentPropTypes & PropType,
        ref
    ) => {
        return (
            <Fragment>
                <BaseBox ref={ref} {...rest}>
                    <img src={src}></img>
                </BaseBox>
                <ComponentInspector path={path}>
                    <GeneralStyleInspector
                        style={rest}
                        requestUpdateProps={requestUpdateProps}
                    ></GeneralStyleInspector>
                </ComponentInspector>
            </Fragment>
        )
    }
)
