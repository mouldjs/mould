import { useState } from 'react'
import { ZoomIn } from 'react-feather'
import '../style/Toolbar.scss'

const Resizer = ({ zoomIn, zoomOut }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const onHover = () => {
        setShowDropdown(!showDropdown)
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
            <p className={`clickable m-t-sm m-b-0 pure`}>Zoom</p>
            <div
                style={{
                    display: showDropdown ? 'block' : 'none',
                    position: 'absolute',
                    width: '120px',
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
                        onClick={zoomIn}
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
                        onClick={zoomOut}
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
                </ul>
            </div>
        </div>
    )
}

export default Resizer
