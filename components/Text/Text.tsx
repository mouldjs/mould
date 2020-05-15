import React, { forwardRef } from 'react'
import { ComponentPropTypes } from '../../app/types'
import { RawText } from './RawText'
import { ComponentInspector } from '../../app/Inspectors'
import {
    LayoutInspector,
    LayoutPropTypes,
    transformLayout,
} from '../../inspector/Layout'
import { ShadowsInspector, ShadowsPropTypes } from '../../inspector/Shadows'

type TextProps = {
    layoutProps?: LayoutPropTypes
    shadowsProps?: ShadowsPropTypes
}

const transform = ({ layoutProps }: TextProps = {}) => {
    return {
        ...transformLayout(layoutProps),
    }
}

export const Text = forwardRef(
    (
        {
            requestUpdateProps,
            path,
            connectedFields,
            layoutProps,
            shadowsProps,
            ...rest
        }: ComponentPropTypes & TextProps,
        ref
    ) => {
        const props = transform({
            layoutProps,
        })

        return (
            <>
                {requestUpdateProps && path && (
                    <ComponentInspector path={path}>
                        <LayoutInspector
                            title="Layout"
                            data={layoutProps}
                            onChange={(data) =>
                                requestUpdateProps({ layoutProps: data })
                            }
                            connectedFields={connectedFields}
                        ></LayoutInspector>
                        <ShadowsInspector
                            title="Shadows"
                            data={shadowsProps}
                            onChange={(data) =>
                                requestUpdateProps({ shadowsProps: data })
                            }
                            connectedFields={connectedFields}
                            withoutSpread
                        ></ShadowsInspector>
                    </ComponentInspector>
                )}
                <RawText ref={ref} {...props} {...rest}></RawText>
            </>
        )
    }
)
