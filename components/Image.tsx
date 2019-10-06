import React, { Fragment } from 'react'
import PropSource from '../app/PropSource'
import { Input } from '@modulz/radix'

export default ({
    src = 'http://wanzao2.baozoumanhua.com/system/series/icons/7112/original/1-1.jpg-s1',
    requestUpdateProps,
    children,
    path,
}) => {
    return (
        <Fragment>
            <img src={src}></img>
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
