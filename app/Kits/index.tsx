import React from 'react'
import { Box } from '@modulz/radix'
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
                    mouldId: mould!.id,
                    type: item.name,
                    param:
                        item.name === 'Mould'
                            ? { mouldId: (item.props as any).__mouldId }
                            : undefined,
                })
            )
        },
    })

    if (!mould) {
        return null
    }

    return (
        <Box minHeight={300} ref={drop}>
            {mould.kits.length ? (
                mould.kits.map((kit, i) => {
                    return (
                        <Item
                            key={kit.name}
                            {...kit}
                            mouldId={mould.id}
                            onConnect={(prop, scope) => {
                                dispatch(
                                    connectScopeToKit({
                                        mouldId: mould.id,
                                        kitIndex: i,
                                        prop,
                                        scope,
                                    })
                                )
                            }}
                            onIsListChange={(checked) => {
                                dispatch(
                                    modifyKit({
                                        mouldId: mould.id,
                                        kitName: kit.name,
                                        isList: checked,
                                    })
                                )
                            }}
                        ></Item>
                    )
                })
            ) : (
                <Box>Drag kits here</Box>
            )}
        </Box>
    )
}
