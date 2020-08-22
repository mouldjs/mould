import React from 'react'
import { LayoutInspector } from '../../inspector/Layout'
import * as z from 'zod'
import { BaseComponentProps } from './baseprops'
import { SFC } from 'react'
import { FillInspector } from '../../inspector/Fill'
import { ParentContext } from '../../app/types'
import { ContainerRelatedInspectors } from '../../inspector/InspectorProvider'
import { BorderInspector } from '../../inspector/Border'
var y = z.enum(['a', 'b'])
var x: z.infer<typeof y>

export const BaseComponentInspectors: SFC<{
    parent: ParentContext | undefined
    data: BaseComponentProps
    requestUpdateProps: (newValue: BaseComponentProps) => void
}> = ({ data, requestUpdateProps, parent }) => {
    return (
        <>
            <ContainerRelatedInspectors
                parent={parent}
                data={data.containerLayoutProps}
                onChange={(data) => {
                    requestUpdateProps({
                        containerLayoutProps: data,
                    })
                }}
            ></ContainerRelatedInspectors>
            <LayoutInspector
                title="Layout"
                data={data.layoutProps}
                onChange={(layoutProps) => requestUpdateProps({ layoutProps })}
            ></LayoutInspector>
            <FillInspector
                title="Fill"
                data={data.fillProps}
                onChange={(fillProps) => requestUpdateProps({ fillProps })}
            ></FillInspector>
            <BorderInspector
                title="Border"
                data={data.borderProps}
                onChange={(borderProps) => {
                    requestUpdateProps({ borderProps })
                }}
            ></BorderInspector>
        </>
    )
}
