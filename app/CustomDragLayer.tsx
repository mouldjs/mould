import React from 'react'
import { useDragLayer } from 'react-dnd'
import GhostKitItem from './CustomDragLayer/GhostKitItem'

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
} as React.CSSProperties

const getItemStyles = (initialOffset, currentOffset, clientOffset) => {
    if (!initialOffset || !currentOffset || !clientOffset) {
        return {
            display: 'none',
        }
    }
    let { x, y } = clientOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}

const CustomDragLayer = () => {
    const {
        clientOffset,
        draggedItem,
        itemType,
        isDragging,
        initialOffset,
        currentOffset,
    } = useDragLayer((monitor) => ({
        clientOffset: monitor.getClientOffset(),
        draggedItem: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }))

    const getGhostLayer = () => {
        switch (itemType) {
            case 'TREE':
                if (draggedItem.name === 'Kit') {
                    return (
                        <GhostKitItem {...draggedItem.layerData}></GhostKitItem>
                    )
                }
            default:
                return null
        }
    }

    if (!isDragging) return null

    return (
        <div style={layerStyles}>
            <div
                style={getItemStyles(
                    initialOffset,
                    currentOffset,
                    clientOffset
                )}
            >
                {getGhostLayer()}
            </div>
        </div>
    )
}

export default CustomDragLayer
