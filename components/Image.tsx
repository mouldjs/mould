import React, { Fragment, forwardRef } from 'react'
import { ComponentInspector } from '../app/Inspectors'
import { Input } from '@modulz/radix'
import { BaseBox } from './BaseComponents'
import { ComponentPropTypes } from '../app/types'
import { GeneralStyleInspector } from './GeneralStyleInspector'

type ImagePropTypes = {
    src: string
}

export default forwardRef(
    (
        {
            src = 'http://wanzao2.baozoumanhua.com/system/series/icons/7112/original/1-1.jpg-s1',
            requestUpdateProps,
            path,
            ...rest
        }: ComponentPropTypes & ImagePropTypes,
        ref
    ) => {
        console.log(rest)

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
