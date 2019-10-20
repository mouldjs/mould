import { useEditable } from './MouldContext'
import PropertyToolBar from './PropertyToolBar'
import { useIsSelectedPath, useIsSelectedMould } from './utils'

export const ComponentInspector = ({ path, children }) => {
    const editable = useEditable()
    const selected = useIsSelectedPath(path)

    return (
        editable &&
        selected && <PropertyToolBar.Source>{children}</PropertyToolBar.Source>
    )
}

export const MouldInspector = ({ mouldId, children }) => {
    const selected = useIsSelectedMould(mouldId)

    return (
        selected && <PropertyToolBar.Source>{children}</PropertyToolBar.Source>
    )
}
