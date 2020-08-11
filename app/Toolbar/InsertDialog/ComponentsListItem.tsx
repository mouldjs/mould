import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { updateDraggingStatus } from '../../appShell'
import { useDrag } from 'react-dnd'
import { Package } from 'react-feather'
const Item = styled.div({
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center',
    padding: '10px 10px',
    borderRadius: '4px',
    marginBottom: 5,
    cursor: 'pointer',
    '&:hover': {
        background: '#D2E9FF',
    },
})

const ItemInfo = styled.div({
    marginLeft: '10px',
    textAlign: 'left',
})

const IconWrapper = styled.div({
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
})

const ItemTitle = styled.p({
    fontSize: '12px',
    fontWeight: 600,
    color: '#000',
    marginBottom: 3,
})

const ItemDesc = styled.p({
    fontSize: '12px',
    color: '#aaa',
    marginBottom: 0,
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    maxWidth: '150px',
    height: '32px',
    textOverflow: 'ellipsis',
})

export default ({ name, icon, desc }: { name; icon?; desc? }) => {
    const dispatch = useDispatch()
    const [, dragRef] = useDrag({
        item: { type: 'TREE', name },
        begin: () => {
            dispatch(updateDraggingStatus({ isDragging: true }))
        },
        end: () => {
            dispatch(updateDraggingStatus({ isDragging: false }))
        },
    })

    const IconComp = icon

    return (
        <Item ref={dragRef}>
            <IconWrapper>{icon ? <IconComp /> : <Package />}</IconWrapper>
            <ItemInfo>
                <ItemTitle>{name}</ItemTitle>
                <ItemDesc>{desc}</ItemDesc>
            </ItemInfo>
        </Item>
    )
}
