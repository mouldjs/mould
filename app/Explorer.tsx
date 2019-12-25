import React, { useState, Fragment } from 'react'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import { Component, EditorState, Mould, Path } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'
import { selectComponent } from '../app/appShell'

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

const ComponentTree = ({ comp, path }: { comp: Component; path: Path }) => {
    const dispatch = useDispatch()
    const { moulds, selection } = useSelector((state: EditorState) => {
        return { moulds: state.moulds, selection: state.selection }
    })

    const label = (
        <Box
            backgroundColor={
                Array.isArray(selection) &&
                (selection as Path).join('/') === path.join('/')
                    ? 'rgba(86, 169, 241, 0.7)'
                    : 'transparent'
            }
            display="inline-block"
            style={{
                cursor: 'pointer',
            }}
            onClick={() => dispatch(selectComponent({ selection: path }))}
        >
            {comp.type === 'Mould'
                ? moulds[(comp.props as any).mouldId].name
                : comp.type}
        </Box>
    )

    return (
        <TreeView nodeLabel={label}>
            {comp.children &&
                comp.children.map((c, index) => {
                    return (
                        <ComponentTree
                            comp={c}
                            path={[...path, index] as Path}
                        ></ComponentTree>
                    )
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
                                        path={[mould.id, state]}
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
