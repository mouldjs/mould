import { useState } from 'react'
import { ZoomIn } from 'react-feather'
import { useSelector } from 'react-redux'
import { EditorState } from '../types'
import { minBy } from 'lodash'
import '../style/Toolbar.scss'

const Resizer = ({}) => {
    const { testWorkspace, views } = useSelector((state: EditorState) => state)
    const [showDropdown, setShowDropdown] = useState(false)
    const onHover = () => {
        setShowDropdown(!showDropdown)
    }
    const scaleValues = [1, 3, 5, 13, 25, 50, 100, 200, 400, 800, 1600, 3200]
    const scaleCenter = [100, 100]
    // const scaleCenter = [minBy(views, 'x') / 2, minBy(views, 'y') / 2]

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
            <p className={`clickable m-t-sm m-b-0 pure`}>{`${
                testWorkspace.zoom ? Math.round(testWorkspace.zoom * 100) : 1
            } %`}</p>
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
                        // onClick={(e) => {zoomIn(e)}}
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
                        // onClick={(e) => {zoomOut(e)}}
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
                        // onClick={() => { setScale(1) }}
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
