import AddMouldTrigger from './AddMouldTrigger'
import styled from 'styled-components'
// import InsertTrigger from './InsertTrigger'
import PanelTrigger from './PanelTrigger'
import DebugTrigger from './DebugTrigger'
import Icons from './Icons'
import React from 'react'
import Resizer from './Resizer'

const RightWrapper = styled.div({
    position: 'absolute',
    right: '10px',
    top: '15px',
    display: 'flex',
})

const Toolbar = ({ height }: { height: string | number }) => {
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
                height,
                width: '100vw',
                zIndex: 2,
            }}
        >
            {/* TODO: Header Refactor*/}
            {/* <InsertTrigger></InsertTrigger> */}
            <AddMouldTrigger></AddMouldTrigger>
            <div className="flex m-l m-r">
                <Icons></Icons>
            </div>
            <Resizer></Resizer>
            <RightWrapper>
                <DebugTrigger />
                <PanelTrigger />
            </RightWrapper>
        </div>
    )
}

export default Toolbar
