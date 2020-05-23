import PropertyToolBar from './PropertyToolBar'
import { useIsSelectedPath, useIsSelectedMould } from './utils'

export const ComponentInspector = ({ path, children }) => {
    const selected = useIsSelectedPath(path)

    return (
        (selected && (
            <PropertyToolBar.Source>
                <div
                    style={{ overflowY: 'auto' }}
                    onWheel={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </PropertyToolBar.Source>
        )) ||
        null
    )
}

export const MouldInspector = ({ mouldId, children }) => {
    const selected = useIsSelectedMould(mouldId)

    return (
        selected && (
            <PropertyToolBar.Source>
                <div
                    style={{ overflowY: 'auto' }}
                    onWheel={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </PropertyToolBar.Source>
        )
    )
}
