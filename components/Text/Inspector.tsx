import React from 'react'
import { Inspector } from '../../app/types'
import {
    TitledBoard,
    ControlGrid,
    ControlGridItem,
} from '../../inspector/FormComponents'
import { Plus, Minus } from 'react-feather'

type TextStyleType = 'normal' | 'italic'

type TextDecorationLineType = 'underline' | 'through'

type TextDecorationStyle = 'wavy' | 'solid' | 'dashed'

export const TextInspector: Inspector<{}> = ({
    title,
    data,
    onChange,
    connectedFields,
}) => {
    return (
        <TitledBoard title={title || 'Text'}>
            {data && (
                <>
                    <ControlGrid></ControlGrid>
                </>
            )}
        </TitledBoard>
    )
}
