import { useEditable } from './MouldContext'
import PropertyToolBar from './PropertyToolBar'
import { useIsSelectedPath, useIsSelectedMould } from './utils'

const PropSource = ({ selection, children }) => {
    const editable = useEditable()
    const isSelectedPath = useIsSelectedPath(selection)
    const isSelectedMould = useIsSelectedMould(selection)
    const selected = isSelectedMould || isSelectedPath

    return editable && selected ? (
        <PropertyToolBar.Source>{children}</PropertyToolBar.Source>
    ) : null
}

export default PropSource
