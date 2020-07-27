import AddMouldTrigger from './AddMouldTrigger'
import InsertTrigger from './InsertTrigger'
import PanelTrigger from './PanelTrigger'
import Icons from './Icons'
import { useSelector } from 'react-redux'
import React from 'react'
import { transform } from '../../compile/transform'
import { EditorState } from '../types'
import Resizer from './Resizer'

const Toolbar = ({}) => {
    const state = useSelector((state: EditorState) => state)

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
            <button
                onClick={() => {
                    console.log(transform(state))
                }}
            >
                test
            </button>
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
