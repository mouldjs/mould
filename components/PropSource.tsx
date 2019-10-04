import { useEditable } from './MouldContext'
import PropertyToolBar from '../app/PropertyToolBar'

const PropSource = ({ children }) => {
    const editable = useEditable()

    return editable ? (
        <PropertyToolBar.Source>{children}</PropertyToolBar.Source>
    ) : null
}

export default PropSource
