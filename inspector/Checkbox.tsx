import React from 'react'
import { Checkbox as C } from '@modulz/radix'

export const Checkbox = (props) => {
    return (
        <C
            {...props}
            sx={{ ...(props.sx || {}), '> div': { width: 16, height: 16 } }}
        ></C>
    )
}
