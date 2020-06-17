import React from 'react'
import { useCurrentMould } from '../utils'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { addKit, connectScopeToKit, modifyKit } from '../appShell'
import Item from './Item'

export const MouldKits = () => {
    const dispatch = useDispatch()
    const mould = useCurrentMould()
    const [{ isOver, canDrop }, drop] = useDrop<
        { type: string; name: string; props?: object },
        void,
        { isOver: boolean; canDrop: boolean }
    >({
        accept: 'TREE',
        drop: (item) => {
            dispatch(
                addKit({
                    mouldName: mould!.name,
                    type: item.name,
                    param:
                        item.name === 'Mould'
                            ? {
                                  mouldName: (item.props as any).__mouldName,
                                  mouldState: (item.props as any).__state,
                              }
                            : undefined,
                })
            )
        },
    })

    if (!mould) {
        return null
    }

    return (
        <div style={{ minHeight: 300 }} ref={drop}>
            {mould.kits.length ? (
                mould.kits.map((kit, i) => {
                    return (
                        <Item
                            key={kit.name}
                            {...kit}
                            mouldName={mould.name}
                            onConnect={(prop, scope) => {
                                dispatch(
                                    connectScopeToKit({
                                        mouldName: mould.name,
                                        kitIndex: i,
                                        prop,
                                        scope,
                                    })
                                )
                            }}
                            onIsListChange={(checked) => {
                                dispatch(
                                    modifyKit({
                                        mouldName: mould.name,
                                        kitName: kit.name,
                                        isList: checked,
                                    })
                                )
                            }}
                        ></Item>
                    )
                })
            ) : (
                <div>Drag kits here</div>
            )}
        </div>
    )
}
