import { useState } from 'react'
import { ZoomIn } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { EditorState } from '../types'
import { zoomWorkspace } from '../appShell'
import '../style/Toolbar.scss'

const Resizer = ({}) => {
    const dispatch = useDispatch()
    const testWorkspace = useSelector(
        (state: EditorState) => state.testWorkspace
    )
    const [showDropdown, setShowDropdown] = useState(false)
    const onHover = () => {
        setShowDropdown(!showDropdown)
    }

    const STEP = 0.25

    const zoomOut = (step, zoom) => {
        const result = zoom - step <= 0 ? 0.01 : zoom - step
        dispatch(zoomWorkspace({ zoom: result }))
    }

    const zoomIn = (step, zoom) => {
        const result = zoom + step >= 5 ? zoom : zoom + step
        dispatch(zoomWorkspace({ zoom: result }))
    }

    const zoomTo100 = () => {
        dispatch(zoomWorkspace({ zoom: 1 }))
    }

    const transferToPercent = (zoom) => {
        return zoom && Math.round(zoom * 100)
    }

    return (
        <div
            className="m-l-lg"
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ZoomIn className="pure"></ZoomIn>
            <p className={`clickable m-t-sm m-b-0 pure`}>
                {testWorkspace.zoom &&
                    `${transferToPercent(testWorkspace.zoom)}%`}
            </p>
            <div
                style={{
                    display: showDropdown ? 'block' : 'none',
                    position: 'absolute',
                    width: '150px',
                    textAlign: 'center',
                    top: '45px',
                    left: '-10px',
                    background: 'gray',
                    zIndex: 2,
                }}
                className="dropdown"
            >
                <ul style={{ margin: 0, paddingLeft: 0 }} className="list pure">
                    <li
                        className="flex clickable justify-space-between p-sm list-item"
                        onClick={() => {
                            zoomIn(STEP, testWorkspace.zoom)
                        }}
                    >
                        <span>Zoom In</span>
                        <span
                            style={{
                                fontSize: '12px',
                                transform: 'scale(0.8)',
                            }}
                        >
                            Ctrl +
                        </span>
                    </li>
                    <li
                        className="flex clickable justify-space-between p-sm list-item"
                        onClick={(e) => {
                            zoomOut(STEP, testWorkspace.zoom)
                        }}
                    >
                        <span>Zoom Out</span>
                        <span
                            style={{
                                fontSize: '12px',
                                transform: 'scale(0.8)',
                            }}
                        >
                            Ctrl -
                        </span>
                    </li>
                    <li
                        className="flex clickable justify-space-between p-sm list-item"
                        onClick={() => {
                            zoomTo100()
                        }}
                    >
                        <span>Zoom To 100%</span>
                        <span
                            style={{
                                fontSize: '12px',
                                transform: 'scale(0.8)',
                            }}
                        >
                            Ctrl 0
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Resizer
