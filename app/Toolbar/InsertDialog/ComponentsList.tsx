import React, { useRef } from 'react'
import styled from 'styled-components'
import { filter, map, groupBy, keys } from 'lodash'
import MouldApp from '../../../mould'
import { useSimulateScroll } from '../../utils'

const Container = styled.div({
    borderRight: '1px solid #aaa',
    flexGrow: 1,
    padding: '5px 10px',
    height: '100%',
    maxWidth: '260px',
    maxHeight: '100%',
    textAlign: 'center',
    overflow: 'auto',
})

const CategoryTitle = styled.div({
    padding: '10px 0',
    fontSize: '12px',
    fontWeight: 600,
})

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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '150px',
    textOverflow: 'ellipsis',
})

const getFormattedComponents = (components) => {
    return map(components, (comp) => {
        return {
            name: comp.type,
            desc: comp.type,
            icon: comp.Icon,
            category: comp.category,
        }
    })
}

const getGroupMap = (components) => {
    const classified = groupBy(components, 'category.name')

    return {
        titles: keys(classified),
        itemMap: classified,
    }
}

export default ({
    onItemSelect,
    currentItem,
    inputValue,
}: {
    onItemSelect: (itemName: string) => void
    currentItem: string
    inputValue: string
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const initialList = getFormattedComponents(MouldApp.components)
    const searchedResult = filter(initialList, (item) => {
        const name = item.name.toUpperCase() || item.desc.toUpperCase()
        const target = inputValue.toUpperCase()
        return name.includes(target)
    })

    const components = getGroupMap(searchedResult)

    useSimulateScroll(containerRef)

    return (
        <Container ref={containerRef}>
            {components.titles.map((title) => {
                const items = components.itemMap[title]
                return [
                    <CategoryTitle>{title}</CategoryTitle>,
                    items.map((item) => {
                        return (
                            <Item
                                onClick={() => onItemSelect(item.name)}
                                style={{
                                    border:
                                        currentItem === item.name
                                            ? '1px solid #56a9f1'
                                            : '',
                                }}
                            >
                                <item.icon></item.icon>
                                <ItemInfo>
                                    <ItemTitle>{item.name}</ItemTitle>
                                    <ItemDesc>{item.desc}</ItemDesc>
                                </ItemInfo>
                            </Item>
                        )
                    }),
                ]
            })}
        </Container>
    )
}
