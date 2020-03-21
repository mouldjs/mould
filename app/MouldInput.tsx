import React from 'react'
import { WithOutContext as TagInput } from 'b1ncer-react-tag-input'
import { useCurrentMould } from './utils'
import { Cell } from '../inspector/FormComponents'
import { useDispatch } from 'react-redux'
import { modifyInput } from './appShell'

export const MouldInput = () => {
    const dispatch = useDispatch()
    const mould = useCurrentMould()

    if (!mould) {
        return null
    }

    const { input } = mould

    return (
        <div className="horizontal-tag-input">
            <TagInput
                placeholder="add new input"
                tags={input.map(input => ({ id: input, text: input }))}
                handleAddition={tag => {
                    dispatch(
                        modifyInput({
                            mouldId: mould.id,
                            input: [...input, tag.text],
                        })
                    )
                }}
                handleDelete={i => {
                    dispatch(
                        modifyInput({
                            mouldId: mould.id,
                            input: input.filter((input, index) => i !== index),
                        })
                    )
                }}
                handleDrag={(tag, currPos, newPos) => {
                    const newInput = [...input]

                    newInput.splice(currPos, 1)
                    newInput.splice(newPos, 0, tag.text)

                    dispatch(
                        modifyInput({
                            mouldId: mould.id,
                            input: newInput,
                        })
                    )
                }}
            ></TagInput>
        </div>
    )
}
