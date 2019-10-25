import React, { useState, Fragment } from 'react'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import { Component, EditorState } from './types'
import { useSelector } from 'react-redux'

const ComponentTree = ({ comp }: { comp: Component }) => {
    return (
        <TreeView nodeLabel={comp.type}>
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
                    <TreeView key={mould.id} nodeLabel={mould.name}>
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
