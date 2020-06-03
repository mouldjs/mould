import AddMouldTrigger from './AddMouldTrigger'
import PanelTrigger from './PanelTrigger'
import Icons from './Icons'
import Resizer from './Resizer'

const Toolbar = ({ zoomIn, zoomOut }) => {
    return (
        <div
            style={{
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                background: '#333',
                alignItems: 'center',
                justifyContent: 'center',
                height: '55px',
                width: '100vw',
                zIndex: 2,
            }}
        >
            <AddMouldTrigger></AddMouldTrigger>
            <div className="flex">
                <Icons></Icons>
            </div>
            <Resizer zoomIn={zoomIn} zoomOut={zoomOut}></Resizer>
            <PanelTrigger></PanelTrigger>
        </div>
    )
}

export default Toolbar
