import React, { useRef } from 'react'
import PropertyToolBar from '../PropertyToolBar'
import { useSimulateScroll } from '../utils'

export default () => {
    const InspectorsBlockRef = useRef<HTMLDivElement>(null)
    useSimulateScroll(InspectorsBlockRef)
    return (
        <div
            ref={InspectorsBlockRef}
            style={{
                width: '100%',
                position: 'absolute',
                height: '100%',
                overflowY: 'auto',
            }}
        >
            <PropertyToolBar.Target />
        </div>
    )
}
