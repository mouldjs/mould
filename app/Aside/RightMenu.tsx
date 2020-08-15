import React, { useState, useEffect, useRef } from 'react'
import { Tab, Tabs } from '@blueprintjs/core'
import { useSelector, useDispatch } from 'react-redux'
import { EditorState } from '../types'
import { MouldStates } from '../MouldStates'
import { TitledBoard } from '../../inspector/FormComponents'
import { Plus } from 'react-feather'
import styled from 'styled-components'
import Operation from './Operation'
import Binding from './Binding'
import { addInput } from '../appShell'
import { useCurrentNode, useCurrentMould, useCurrentState } from '../utils'
import DebugPanel from '../DebugPanel'
import { DropdownMenu, Button, Menu, MenuItem } from '@modulz/radix'
import { MouldInput } from '../MouldInput'
import MouldApp from '../../mould'

const InputTypes = Object.keys(MouldApp.Controls)

type TabId = 'operation' | 'binding'

const Container = styled.div({
    width: 215,
    transition: '0.3s',
    position: 'absolute',
    zIndex: 1,
    borderLeft: '1px solid #aaa',
    backgroundColor: '#e1e1e1',
})

export default ({ headerHeight }: { headerHeight }) => {
    const dispatch = useDispatch()
    const hasSelection = useSelector((state: EditorState) => !!state.selection)
    const [currentTab, setCurrentTab] = useState('operation')
    const handleTabChange = (navbarTabId: TabId) => setCurrentTab(navbarTabId)
    const mould = useCurrentMould()
    const mouldName = mould?.name
    const stateName = useCurrentState()
    const { node, isRoot } = useCurrentNode()
    const isKit = node?.type === 'Kit'
    const [addingControlType, setAddingControlType] = useState<string | null>(
        null
    )

    return (
        <Container
            style={{
                right: hasSelection ? 0 : -215,
                top: `${headerHeight}px`,
                height: `calc(100vh - ${headerHeight}px)`,
            }}
        >
            {isKit || isRoot ? (
                <Tabs
                    id="Tabs"
                    className="right-tabs"
                    selectedTabId={currentTab}
                    onChange={handleTabChange}
                    large
                >
                    <Tab
                        id="operation"
                        title="Operation"
                        panel={<Operation />}
                    />

                    <Tab
                        id="binding"
                        title={isKit ? 'Binding' : 'Inputs'}
                        panel={
                            <>
                                {isKit && (
                                    <TitledBoard title="Kit">
                                        <Binding
                                            mouldName={mouldName}
                                            stateName={stateName}
                                            node={node}
                                        />
                                    </TitledBoard>
                                )}

                                {isRoot && (
                                    <TitledBoard
                                        title="Inputs"
                                        renderTitle={() => {
                                            return (
                                                <>
                                                    <DropdownMenu
                                                        button={
                                                            <Button
                                                                variant="ghost"
                                                                style={{
                                                                    padding: 0,
                                                                    paddingLeft: 8,
                                                                }}
                                                            >
                                                                <Plus
                                                                    color="#959595"
                                                                    size={16}
                                                                ></Plus>
                                                            </Button>
                                                        }
                                                        menu={
                                                            <Menu>
                                                                {InputTypes.map(
                                                                    (
                                                                        controlType
                                                                    ) => {
                                                                        return (
                                                                            <MenuItem
                                                                                onSelect={() => {
                                                                                    setAddingControlType(
                                                                                        controlType
                                                                                    )
                                                                                }}
                                                                                label={
                                                                                    controlType
                                                                                }
                                                                            ></MenuItem>
                                                                        )
                                                                    }
                                                                )}
                                                            </Menu>
                                                        }
                                                    ></DropdownMenu>
                                                    {addingControlType && (
                                                        <MouldInput
                                                            isOpen={
                                                                !!(addingControlType as any)
                                                            }
                                                            onClose={() => {
                                                                setAddingControlType(
                                                                    null
                                                                )
                                                            }}
                                                            type={
                                                                addingControlType as string
                                                            }
                                                            onSubmit={(
                                                                name,
                                                                config
                                                            ) => {
                                                                mouldName &&
                                                                    dispatch(
                                                                        addInput(
                                                                            {
                                                                                inputKey: name,
                                                                                config,
                                                                                mouldName,
                                                                            }
                                                                        )
                                                                    )
                                                            }}
                                                        ></MouldInput>
                                                    )}
                                                </>
                                            )
                                        }}
                                    >
                                        <DebugPanel.Target />
                                    </TitledBoard>
                                )}
                            </>
                        }
                    />
                </Tabs>
            ) : (
                <Operation />
            )}
            <MouldStates></MouldStates>
        </Container>
    )
}
