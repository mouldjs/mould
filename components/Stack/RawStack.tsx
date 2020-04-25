import React, { forwardRef } from 'react'

export const RawStack = forwardRef(({ children, ...props }, ref) => {
    return (
        <div ref={ref as any} {...props}>
            {children}
        </div>
    )
}) as any
