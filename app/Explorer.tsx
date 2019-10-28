import React, { useState, Fragment } from 'react'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import { Component, EditorState, Mould } from './types'
import { useSelector } from 'react-redux'
import { Box } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'

const MouldLabel = (mould: Mould) => {
    const [, drag] = useDrag({
        item: { type: 'TREE', name: 'Mould', props: { mouldId: mould.id } },
    })

    return (
        <Box display="inline-block" ref={drag}>
            {mould.name}
        </Box>
    )
}

const ComponentTree = ({ comp }: { comp: Component }) => {
    const moulds = useSelector((state: EditorState) => {
        return state.moulds
    })

    const label =
        comp.type === 'Mould'
            ? moulds[(comp.props as any).mouldId].name
            : comp.type

    return (
        <TreeView nodeLabel={label}>
            {comp.children &&
                comp.children.map(c => {
                    return <ComponentTree comp={c}></ComponentTree>
                })}
        </TreeView>
    )
}

export const Explorer = () => {
    const moulds = useSelector((state: EditorState) => {
        return state.moulds
    })

    return (
        <Fragment>
            {Object.values(moulds).map(mould => {
                return (
                    <TreeView
                        key={mould.id}
                        nodeLabel={<MouldLabel {...mould}></MouldLabel>}
                    >
                        {Object.keys(mould.states).map(state => {
                            return (
                                <TreeView key={state} nodeLabel={state}>
                                    <ComponentTree
                                        comp={mould.states[state]}
                                    ></ComponentTree>
                                </TreeView>
                            )
                        })}
                    </TreeView>
                )
            })}
        </Fragment>
    )
}
