import React from 'react'
import { TitledBoard, ControlGrid, ControlGridItem } from './FormComponents'
import { Plus, Minus } from 'react-feather'
import { NumericInput, ControlGroup } from '@blueprintjs/core'
import { Text } from '@modulz/radix'
import { Checkbox } from './Checkbox'
import { ColorType, ColorControl } from './Color'
import { Inspector } from '../app/types'
import { intersection } from 'ramda'

type ShadowType = {
    active: boolean
    color: ColorType
    x: number
    y: number
    blur: number
    spread: number
}

export type ShadowsPropTypes = ShadowType[]

const initialData: ShadowType = {
    active: true,
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.25,
    },
    x: 0,
    y: 2,
    blur: 5,
    spread: 0,
}

export const ShadowsInspector: Inspector<ShadowsPropTypes> = ({
    title,
    data,
    onChange,
    connectedFields,
}) => {
    const fields = intersection(connectedFields || [], ['shadow'])
    if (connectedFields && !fields.length) {
        return null
    }

    return (
        <TitledBoard
            collspaed={!data}
            title={title || 'Shadows'}
            renderTitle={() => {
                const inactiveShadows = (data || []).filter(
                    (shadow) => !shadow.active
                )

                return (
                    <>
                        {inactiveShadows.length > 0 && (
                            <Minus
                                onClick={() => {
                                    const next = (data || []).filter(
                                        (shadow) => shadow.active
                                    )
                                    onChange(next.length ? next : undefined)
                                }}
                                color="#959595"
                                size={16}
                            ></Minus>
                        )}
                        <Plus
                            onClick={() => {
                                const next = [
                                    ...(data || []),
                                    { ...initialData },
                                ]
                                onChange(next)
                            }}
                            color="#959595"
                            size={16}
                        ></Plus>
                    </>
                )
            }}
        >
            {data &&
                data.map((shadow, index) => {
                    return (
                        <>
                            <ControlGrid
                                marginBottom={index === data.length - 1 ? 0 : 8}
                            >
                                <ControlGridItem area="active">
                                    <Checkbox
                                        checked={shadow.active}
                                        onChange={(event) => {
                                            const next = [...data]
                                            next[index] = {
                                                ...shadow,
                                                active: event.target.checked,
                                            }
                                            onChange(next)
                                        }}
                                    ></Checkbox>
                                </ControlGridItem>
                                <ControlGridItem area="visual">
                                    <ColorControl
                                        color={shadow.color}
                                        onChange={(color) => {
                                            const next = [...data]
                                            next[index] = { ...shadow, color }
                                            onChange(next)
                                        }}
                                    ></ColorControl>
                                </ControlGridItem>
                                <ControlGridItem area="value / value / control / control">
                                    <ControlGroup fill>
                                        <NumericInput
                                            value={shadow.x}
                                            onValueChange={(value) => {
                                                const next = [...data]
                                                next[index] = {
                                                    ...shadow,
                                                    x: value,
                                                }
                                                onChange(next)
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                        <NumericInput
                                            value={shadow.y}
                                            onValueChange={(value) => {
                                                const next = [...data]
                                                next[index] = {
                                                    ...shadow,
                                                    y: value,
                                                }
                                                onChange(next)
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                        <NumericInput
                                            value={shadow.blur}
                                            onValueChange={(value) => {
                                                const next = [...data]
                                                next[index] = {
                                                    ...shadow,
                                                    blur: value,
                                                }
                                                onChange(next)
                                            }}
                                            fill
                                            buttonPosition="none"
                                            min={0}
                                        ></NumericInput>
                                        <NumericInput
                                            value={shadow.spread}
                                            onValueChange={(value) => {
                                                const next = [...data]
                                                next[index] = {
                                                    ...shadow,
                                                    spread: value,
                                                }
                                                onChange(next)
                                            }}
                                            fill
                                            buttonPosition="none"
                                        ></NumericInput>
                                    </ControlGroup>
                                </ControlGridItem>
                            </ControlGrid>
                        </>
                    )
                })}
            <ControlGrid>
                <ControlGridItem area="value / value / control / control">
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        X
                    </Text>
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        Y
                    </Text>
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        B
                    </Text>
                    <Text
                        size={0}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        S
                    </Text>
                </ControlGridItem>
            </ControlGrid>
        </TitledBoard>
    )
}
