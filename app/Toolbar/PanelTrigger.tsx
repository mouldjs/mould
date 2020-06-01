import { useSelector, useDispatch } from 'react-redux'
import { EditorState, Path } from '../../app/types'
import { selectComponent, selectComponentFromTree } from '../../app/appShell'
import { AlignRight } from 'react-feather'

const PanelTrigger = () => {
    const dispatch = useDispatch()

    const { selection, moulds } = useSelector((state: EditorState) => state)
    const specific: { mouldId?: string; states?: object } = {}
    const mould = moulds && moulds[Object.keys(moulds)[0]]
    if (mould) {
        specific.mouldId = mould.id
        specific.states = mould.states
    }

    const stateName = specific.states && Object.keys(specific.states)[0]

    const select = ({ mouldId, stateName }) => {
        const path: Path = [[mouldId, stateName], []]
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
    const visible = specific.mouldId && stateName

    return (
        <>
            {visible && (
                <AlignRight
                    onClick={() => {
                        selection
                            ? unselect()
                            : select({
                                  mouldId: specific.mouldId,
                                  stateName,
                              })
                    }}
                    className={
                        selection ? 'clickable primary' : 'clickable pure'
                    }
                    style={{ position: 'absolute', right: '10px', top: '15px' }}
                ></AlignRight>
            )}
        </>
    )
}

export default PanelTrigger
