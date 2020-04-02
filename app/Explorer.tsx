import React, { useState, Fragment, ReactNode } from 'react'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import Tree, { TreeNode } from 'rc-tree'
import './rc-tree.css'
import { Component, EditorState, Mould, Path } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@modulz/radix'
import { useDrag } from 'react-dnd'
import { selectComponent, sortTree } from '../app/appShell'
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

const pathToString = (path: Path) => path[0].join('/') + '/' + path[1].join('-')

const ComponentTree2 = ({
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
        <TreeNode key={pathToString(path)} title={label}>
            {comp.children &&
                comp.children.map((c, index) => {
                    return (
                        <ComponentTree2
                            comp={c}
                            path={[path[0], [...path[1], index]]}
                        ></ComponentTree2>
                    )
                })}
        </TreeNode>
    )
}

const isSelectedPath = (path: Path, currentPath: Path | undefined) =>
    path !== undefined &&
    currentPath !== undefined &&
    [currentPath[0].join('/'), currentPath[1].join('/')].join('+') ===
        [path[0].join('/'), path[1].join('/')].join('+')

export const Explorer2 = () => {
    const dispatch = useDispatch()
    const { moulds, selection } = useSelector((state: EditorState) => {
        return { moulds: state.moulds, selection: state.selection }
    })
    if (!selection) {
        return null
    }
    const mould = moulds[selection[0][0]]
    const stateName = selection[0][1]

    const selectedTree = mould.states[stateName]

    const onDragStart = (info) => {
        console.log('start', info)
    }

    const onDragEnter = (info) => {
        console.log('enter', info)
    }

    const onDrop = (info) =>
        dispatch(
            sortTree({
                info,
            })
        )

    const renderComponentTree = ({
        comp,
        path,
        label,
    }: {
        comp: Component
        path: Path
        label?: ReactNode
    }) => {
        const isSelected = isSelectedPath(path, selection)

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
                        ? moulds[(comp.props as any).__mouldId].name
                        : comp.type === 'Kit'
                        ? (comp.props as any).__kitName
                        : comp.type)}
            </Box>
        )

        return (
            <TreeNode key={`${path[1].join('-')}`} title={label}>
                {comp.children &&
                    comp.children.map((c, index) => {
                        return renderComponentTree({
                            comp: c,
                            path: [path[0], [...path[1], index]],
                        })
                    })}
            </TreeNode>
        )
    }

    return (
        <div className="draggable-container">
            {/* <Tree
                key={selection[0].join('/')}
                draggable
                defaultExpandAll
                selectable={false}
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
            >
                {renderComponentTree({
                    comp: selectedTree,
                    path: [selection[0], []],
                    label: 'Root',
                })}
            </Tree> */}
        </div>
    )
}
