import React, { useState, Fragment, ReactNode } from 'react'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import { Component, EditorState, Mould, Path } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'
import { selectComponent } from '../app/appShell'
import { useIsSelectedPath } from './utils'

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

const ComponentTree = ({
    comp,
    path,
    label,
}: {
    comp: Component
    path: Path
    label?: ReactNode
}) => {
    const dispatch = useDispatch()
    const { moulds, selection } = useSelector((state: EditorState) => {
        return { moulds: state.moulds, selection: state.selection }
    })
    const isSelected = useIsSelectedPath(path)

    label = (
        <Box
            backgroundColor={
                Array.isArray(selection) && isSelected
                    ? 'rgba(86, 169, 241, 0.7)'
                    : 'transparent'
            }
            display="inline-block"
            style={{
                cursor: 'pointer',
            }}
            onClick={() => dispatch(selectComponent({ selection: path }))}
        >
            {label ||
                (comp.type === 'Mould'
                    ? moulds[(comp.props as any).mouldId].name
                    : comp.type)}
        </Box>
    )

    return (
        <TreeView nodeLabel={label}>
            {comp.children &&
                comp.children.map((c, index) => {
                    return (
                        <ComponentTree
                            comp={c}
                            path={[path[0], [...path[1], index]]}
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
                            // return
                            // <TreeView key={state} nodeLabel={state}>
                            //     {mould.states[state] && (
                            //         <ComponentTree
                            //             comp={
                            //                 mould.states[state] as Component
                            //             }
                            //             path={[[mould.id, state], []]}
                            //         ></ComponentTree>
                            //     )}
                            // </TreeView>
                            return (
                                mould.states[state] && (
                                    <ComponentTree
                                        key={state}
                                        comp={mould.states[state] as Component}
                                        path={[[mould.id, state], []]}
                                        label={state}
                                    ></ComponentTree>
                                )
                            )
                        })}
                    </TreeView>
                )
            })}
        </Fragment>
    )
}
