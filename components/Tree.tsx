import React, { forwardRef } from 'react'
import { Component, AtomicComponent } from '../app/types'
import Components from '.'

const Tree = forwardRef(
    (
        { component: { type, children, props } }: { component: Component },
        ref
    ) => {
        const plugin = Components.find(
            (c) => c.type === type
        ) as AtomicComponent

        if (!plugin) {
            return null
        }

        const Comp = plugin.Editable

        return (
            <Comp ref={ref} {...props}>
                {children && children.map((c) => <Tree component={c}></Tree>)}
            </Comp>
        )
    }
)

export default Tree
