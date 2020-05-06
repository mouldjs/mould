import React from 'react'
import { useDragLayer } from 'react-dnd'
import GhostKitItem from '@components/CustomDragLayer/GhostKitItem'

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    transform: 'rotate(-5deg)',
} as React.CSSProperties

const getItemStyles = (initialOffset, currentOffset) => {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }
    let { x, y } = currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}

const CustomDragLayer = () => {
    const {
        draggedItem,
        itemType,
        isDragging,
        initialOffset,
        currentOffset,
    } = useDragLayer((monitor) => ({
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
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {getGhostLayer()}
            </div>
        </div>
    )
}

export default CustomDragLayer
