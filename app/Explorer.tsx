import React, { useState, Fragment, ReactNode } from 'react'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import Tree, { TreeNode } from 'rc-tree'
import './rc-tree.css'
import { Component, EditorState, Mould, Path } from './types'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@modulz/radix'
import { useDrag } from 'react-dnd-cjs'
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
    // const moulds = useSelector((state: EditorState) => {
    //     return state.moulds
    // })
    // const [expandedKeys, setExpandedK] = useState()
    const dispatch = useDispatch()
    const { moulds, selection } = useSelector((state: EditorState) => {
        return { moulds: state.moulds, selection: state.selection }
    })
    const selectedTree =
        selection && moulds[selection[0][0]].states[selection[0][1]]

    if (!selectedTree || !selection) {
        return null
    }

    const onDragStart = info => {
        console.log('start', info)
    }

    const onDragEnter = info => {
        console.log('enter', info)
    }

    const onDrop = info => {
        console.log('drop', info, info.event.target)
        // const dropKey = info.node.props.eventKey
        // const dragKey = info.dragNode.props.eventKey
        // const dropPos = info.node.props.pos.split('-')
        // const dropPosition =
        //     info.dropPosition - Number(dropPos[dropPos.length - 1])

        // console.log({
        //     dropKey,
        //     dragKey,
        //     dropPos,
        //     dropPosition,
        //     dropToGap: info.dropToGap,
        // })

        // const loop = (data, key, addPath, callback) => {
        //     data.forEach((item, index, arr) => {
        //         const path = addPath ? `${addPath}-${index}` : `${index}`
        //         if (path === key) {
        //             callback(item, index, arr)
        //             return
        //         }
        //         if (item.children) {
        //             loop(item.children, key, path, callback)
        //         }
        //     })
        // }
        // const data = [selectedTree]

        // // Find dragObject
        // let dragObj
        // loop(data, dragKey, '', (item, index, arr) => {
        //     arr.splice(index, 1)
        //     dragObj = item
        // })

        // if (!info.dropToGap) {
        //     // Drop on the content
        //     loop(data, dropKey, '', item => {
        //         item.children = item.children || []
        //         // where to insert 示例添加到尾部，可以是随意位置
        //         item.children.push(dragObj)
        //     })
        // } else if (
        //     (info.node.props.children || []).length > 0 && // Has children
        //     info.node.props.expanded && // Is expanded
        //     dropPosition === 1 // On the bottom gap
        // ) {
        //     loop(data, dropKey, '', item => {
        //         item.children = item.children || []
        //         // where to insert 示例添加到尾部，可以是随意位置
        //         item.children.unshift(dragObj)
        //     })
        // } else {
        //     // Drop on the gap
        //     let ar
        //     let i
        //     loop(data, dropKey, '', (item, index, arr) => {
        //         ar = arr
        //         i = index
        //     })
        //     if (dropPosition === -1) {
        //         ar.splice(i, 0, dragObj)
        //     } else {
        //         ar.splice(i + 1, 0, dragObj)
        //     }
        // }

        dispatch(
            sortTree({
                info,
            })
        )
    }

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
                        ? moulds[(comp.props as any).mouldId].name
                        : comp.type)}
            </Box>
        )

        return (
            <TreeNode key={`0-${path[1].join('-')}`} title={label}>
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
        <>
            {selectedTree && selection && (
                <div className="draggable-container">
                    <Tree
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
                            label: selection[0][1],
                        })}
                    </Tree>
                </div>
            )}
        </>
    )
}
