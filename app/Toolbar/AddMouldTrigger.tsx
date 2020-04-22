import { useDispatch } from 'react-redux'
import { Plus } from 'react-feather'
import { waitingForCreating } from '../appShell'
import nanoid from 'nanoid'

const AddMouldTrigger = () => {
    const dispatch = useDispatch()
    // const viewsLength = useSelector((state: EditorState) => {
    //     return Object.values(state.views).length
    // })
    // const mouldCount = useSelector(
    //     (state: EditorState) => Object.keys(state.moulds).length
    // )

    return (
        <Plus
            color="#fff"
            onClick={() =>
                // dispatch(
                //     addMould({
                //         x: 50,
                //         y: 100 + (100 + 500 + 70) * viewsLength,
                //         width: 300,
                //         height: 500,
                //     })
                // )
                dispatch(
                    waitingForCreating({
                        mouldId: nanoid(6),
                        stateName: 'state 0',
                    })
                )
            }
        ></Plus>
    )
}

export default AddMouldTrigger
