import React, { Fragment, forwardRef } from 'react'
import PropSource from '../app/PropSource'
import { Input } from '@modulz/radix'
import { BaseBox } from './BaseComponents'
import { ComponentPropTypes } from '../app/types'

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
        return (
            <Fragment>
                <BaseBox ref={ref} {...rest}>
                    <img src={src}></img>
                </BaseBox>
                <PropSource path={path}>
                    <Input
                        value={src}
                        placeholder="please set img src"
                        variant="fade"
                        onChange={e => {
                            requestUpdateProps({ src: e.target.value })
                        }}
                    ></Input>
                </PropSource>
            </Fragment>
        )
    }
)
