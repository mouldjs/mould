import React, { forwardRef, useContext } from 'react'
import { ComponentPropTypes } from '../app/types'
import components from './'
import { MouldContext, ViewContext } from '../app/Contexts'
import List from './List'

export default forwardRef(
    (
        {
            __kitName,
            requestUpdateProps,
            children,
            path,
            ...rest
        }: ComponentPropTypes & { __kitName: string },
        ref
    ) => {
        const mould = useContext(MouldContext)
        const view = useContext(ViewContext)
        if (!mould || !view) {
            return null
        }
        const isHostMould = mould.id === view.mouldId
        const kit = mould.kits.find((kit) => kit.name === __kitName)
        if (!kit) {
            return null
        }
        const isMould = kit.type === 'Mould'
        const mouldProp = isMould
            ? { __mouldId: (kit.param as any).mouldId }
            : {}
        const connectedFields = isHostMould
            ? undefined
            : kit.dataMappingVector.map(([field]) => field)
        if (kit.isList) {
            const Comp = List

            return (
                <Comp
                    ref={ref}
                    requestUpdateProps={requestUpdateProps}
                    path={path}
                    connectedFields={connectedFields}
                    {...mouldProp}
                    {...rest}
                >
                    {children}
                </Comp>
            )
        }

        const plugin = components.find((c) => c.type === kit.type)
        if (!plugin) {
            return null
        }

        const Comp = plugin.Editable

        return (
            <Comp
                ref={ref}
                requestUpdateProps={requestUpdateProps}
                path={path}
                connectedFields={connectedFields}
                {...mouldProp}
                {...rest}
            >
                {children}
            </Comp>
        )
    }
)
