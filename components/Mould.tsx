import React, { forwardRef } from 'react'
import {
    Mould as MouldType,
    Component,
    ComponentPropTypes,
    EditorState,
} from '../app/types'
import Components from '.'
import { useSelector } from 'react-redux'

const Tree = forwardRef(
    ({ type, props, children, ...rest }: Component, ref) => {
        const Comp = Components[type]

        return (
            <Comp {...rest} {...props} ref={ref}>
                {children && children.map(c => <Tree {...c}></Tree>)}
            </Comp>
        )
    }
)

const Mould = forwardRef(
    (
        {
            mouldId,
            requestUpdateProps,
            children,
            path,
            ...rest
        }: ComponentPropTypes & { mouldId: string },
        ref
    ) => {
        const { states } = useSelector((state: EditorState) => {
            return state.moulds[mouldId]
        })
        const defaultTree = Object.values(states)[0]
        // console.log(2222, path, rest)

        return <Tree {...rest} {...defaultTree} ref={ref}></Tree>
    }
)

export default Mould
