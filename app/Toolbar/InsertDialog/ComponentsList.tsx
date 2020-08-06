import React, { useRef } from 'react'
import styled from 'styled-components'
import { filter, map, groupBy, keys } from 'lodash'
import MouldApp from '../../../mould'
import { useSimulateScroll } from '../../utils'
import ListItem from './ComponentsListItem'

const Container = styled.div({
    flexGrow: 1,
    padding: '5px 10px',
    height: '100%',
    maxWidth: '260px',
    maxHeight: '100%',
    textAlign: 'center',
    overflow: 'auto',
    backgroundColor: '#fff',
    borderRight: '1px solid #ddd',
})

const CategoryTitle = styled.div({
    padding: '10px 0',
    fontSize: '12px',
    fontWeight: 600,
})

const getFormattedComponents = (components) => {
    return map(components, (comp) => {
        return {
            name: comp.type,
            desc: `Drag ${comp.type} to workspace`,
            icon: comp.Icon,
            category: comp.category,
        }
    })
}

const getGroupMap = (components) => {
    const classified = groupBy(components, 'category.name')

    return {
        titles: keys(classified).sort(),
        itemMap: classified,
    }
}

export default ({ inputValue }: { inputValue: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const initialList = getFormattedComponents(MouldApp.components)
    const searchedResult = filter(initialList, (item) => {
        const name = item.name.toUpperCase()
        const desc = item.desc.toUpperCase()
        const target = inputValue.toUpperCase()

        return name.includes(target) || desc.includes(target)
    })

    const components = getGroupMap(searchedResult)

    useSimulateScroll(containerRef)

    return (
        <Container ref={containerRef}>
            {searchedResult.length ? (
                components.titles.map((title) => {
                    const items = components.itemMap[title]

                    return [
                        <CategoryTitle>{title}</CategoryTitle>,
                        items.map((item) => {
                            return (
                                <ListItem
                                    name={item.name}
                                    icon={item.icon}
                                    desc={item.desc}
                                />
                            )
                        }),
                    ]
                })
            ) : (
                <CategoryTitle>No Results</CategoryTitle>
            )}
        </Container>
    )
}
