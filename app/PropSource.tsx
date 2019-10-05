import { useEditable } from './MouldContext'
import PropertyToolBar from './PropertyToolBar'
import { useSelector } from 'react-redux'
import { EditorState } from './types'
import { selectedThis } from './utils'

const PropSource = ({ path, children }) => {
    const editable = useEditable()
    const selection = useSelector((state: EditorState) => state.selection)

    return editable && selectedThis(selection, path) ? (
        <PropertyToolBar.Source>{children}</PropertyToolBar.Source>
    ) : null
}

export default PropSource
