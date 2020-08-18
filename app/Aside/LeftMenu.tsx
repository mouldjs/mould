import React, { useState, useRef, useEffect } from 'react'
import { Box } from '@modulz/radix'
import { TitledBoard } from '../../inspector/FormComponents'
import { Explorer2 } from '../Explorer'
import { useSelector } from 'react-redux'
import { EditorState } from '../types'
import SearchBar from '../Toolbar/InsertDialog/SearchBar'
import ComponentsList from '../Toolbar/InsertDialog/ComponentsList'

export default ({ headerHeight }: { headerHeight }) => {
    const HierarchyBlockRef = useRef<HTMLDivElement>(null)
    const hasSelection = useSelector((state: EditorState) => !!state.selection)
    const [inputValue, setInputValue] = useState('')
    const [hierarchyBlockHeight, setHierarchyBlockHeight] = useState(50)
    const onInput = (value) => setInputValue(value)

    useEffect(() => {
        if (HierarchyBlockRef.current) {
            setHierarchyBlockHeight(HierarchyBlockRef.current.clientHeight)
            console.log(hierarchyBlockHeight, 'hierarchyBlockHeight in effect')
        }
    })
    return (
        <Box
            translate
            style={{
                transition: '0.3s',
                position: 'absolute',
                left: hasSelection ? 0 : -215,
                top: `${headerHeight}px`,
                height: `calc(100vh - ${headerHeight}px)`,
                width: '215px',
                zIndex: 1,
                borderRight: '1px solid #aaaaaa',
                backgroundColor: '#e1e1e1',
            }}
        >
            <div ref={HierarchyBlockRef}>
                <TitledBoard title="Hierarchy">
                    <Explorer2></Explorer2>
                </TitledBoard>
            </div>
            <div>
                <TitledBoard title="Libraries">
                    <div
                        style={{
                            height: `calc(100vh - 50px - ${hierarchyBlockHeight}px - 31px - 16px)`,
                        }}
                    >
                        <SearchBar onInput={onInput} />
                        <ComponentsList inputValue={inputValue} />
                    </div>
                </TitledBoard>
            </div>
        </Box>
    )
}
