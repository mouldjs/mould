import React, { forwardRef, useContext } from 'react'
import { Kit, ComponentPropTypes } from '../app/types'
import components from './'
import MouldContext from '../app/MouldContext'

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
        if (!mould) {
            return null
        }
        const kit = mould.kits.find(kit => kit.name === __kitName)
        if (!kit) {
            return null
        }
        const plugin = components.find(c => c.type === kit.type)
        if (!plugin) {
            return null
        }

        const Comp = plugin.component

        return (
            <Comp
                ref={ref}
                requestUpdateProps={requestUpdateProps}
                path={path}
                {...rest}
            >
                {children}
            </Comp>
        )
    }
)
