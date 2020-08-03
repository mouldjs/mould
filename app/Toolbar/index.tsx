import AddMouldTrigger from './AddMouldTrigger'
import InsertTrigger from './InsertTrigger'
import PanelTrigger from './PanelTrigger'
import Icons from './Icons'
import React from 'react'
import Resizer from './Resizer'

const Toolbar = ({}) => {
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
            <InsertTrigger></InsertTrigger>
            <AddMouldTrigger></AddMouldTrigger>
            <div className="flex m-l m-r">
                <Icons></Icons>
            </div>
            <Resizer></Resizer>
            <PanelTrigger></PanelTrigger>
        </div>
    )
}

export default Toolbar
