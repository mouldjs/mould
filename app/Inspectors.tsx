import { useEditable } from './MouldContext'
import PropertyToolBar from './PropertyToolBar'
import { useIsSelectedPath, useIsSelectedMould } from './utils'
import { Box } from '@modulz/radix'

export const ComponentInspector = ({ path, children }) => {
    const editable = useEditable()
    const selected = useIsSelectedPath(path)

    return (
        editable &&
        selected && (
            <PropertyToolBar.Source>
                <Box onDoubleClick={e => e.stopPropagation()}>{children}</Box>
            </PropertyToolBar.Source>
        )
    )
}

export const MouldInspector = ({ mouldId, children }) => {
    const selected = useIsSelectedMould(mouldId)

    return (
        selected && (
            <PropertyToolBar.Source>
                <Box onDoubleClick={e => e.stopPropagation()}>{children}</Box>
            </PropertyToolBar.Source>
        )
    )
}
