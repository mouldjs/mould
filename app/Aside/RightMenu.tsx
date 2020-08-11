import React, { useState } from 'react'
import { Tab, Tabs } from '@blueprintjs/core'
import Operation from './Operation'
import { useSelector } from 'react-redux'
import { EditorState } from '../types'
import styled from 'styled-components'

type TabId = 'operation' | 'binding'

const TabWrapper = styled.div({
    width: 215,
    transition: '0.3s',
    position: 'absolute',
    zIndex: 1,
    borderLeft: '1px solid #aaa',
    backgroundColor: '#e1e1e1',
})

export default ({ headerHeight }: { headerHeight }) => {
    const hasSelection = useSelector((state: EditorState) => !!state.selection)
    const [currentTab, setCurrentTab] = useState('operation')
    const handleTabChange = (navbarTabId: TabId) => setCurrentTab(navbarTabId)

    return (
        <TabWrapper
            style={{
                right: hasSelection ? 0 : -215,
                top: `${headerHeight}px`,
                height: `calc(100vh - ${headerHeight}px)`,
            }}
        >
            <Tabs
                id="Tabs"
                className="right-tabs"
                selectedTabId={currentTab}
                onChange={handleTabChange}
                renderActiveTabPanelOnly={true}
                large
            >
                <Tab id="operation" title="Operation" panel={<Operation />} />
                <Tab id="binding" title="Binding" panel={<div>abbbaa</div>} />
            </Tabs>
        </TabWrapper>
    )
}
