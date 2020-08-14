import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { EditorState, Path } from '../../app/types'
import { selectComponent, selectComponentFromTree } from '../../app/appShell'
import { AlignRight } from 'react-feather'

export default () => {
    const dispatch = useDispatch()

    const { selection, moulds } = useSelector((state: EditorState) => state)
    const specific: { mouldName?: string; states?: object } = {}
    const mould = moulds && moulds[0]
    if (mould) {
        specific.mouldName = mould.name
        specific.states = mould.states
    }

    const stateName = specific.states && Object.keys(specific.states)[0]

    const select = ({ mouldName, stateName }) => {
        const path: Path = [[mouldName, stateName], []]
        const pathData: any = [path]
        dispatch(
            selectComponent({
                pathes: pathData,
            })
        )
    }

    const unselect = () => {
        dispatch(
            selectComponentFromTree({
                path: undefined,
            })
        )
    }

    const visible = specific.mouldName && stateName

    return (
        <>
            {visible && (
                <AlignRight
                    onClick={() => {
                        selection
                            ? unselect()
                            : select({
                                  mouldName: specific.mouldName,
                                  stateName,
                              })
                    }}
                    className={
                        selection ? 'clickable primary' : 'clickable pure'
                    }
                ></AlignRight>
            )}
        </>
    )
}
