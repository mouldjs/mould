import React from 'react'
import * as z from 'zod'
import { Inspector } from '../app/types'
import { TitledBoard } from './FormComponents'
import { TypedControl, getControlByType } from './control'

type ReflectInspector<T extends z.ZodObject<any>> = Inspector<z.infer<T>>
type TitleOf<T extends object> = {
    [K in keyof T]?: string
}

type ControlOf<T extends z.ZodObject<any>> = {
    [K in keyof z.infer<T>]?: TypedControl<T['_shape'][K]>
}

function isPlainType(
    t: z.ZodTypeAny
): t is
    | z.ZodNumber
    | z.ZodString
    | z.ZodBoolean
    | z.ZodEnum<[string, ...string[]]> {
    if (t instanceof z.ZodNumber) return true
    if (t instanceof z.ZodString) return true
    if (t instanceof z.ZodBoolean) return true
    if (t instanceof z.ZodEnum) return true
    return false
}

function getPlainType(
    t: z.ZodUnion<any> | z.ZodNumber | z.ZodString | z.ZodBoolean
):
    | z.ZodNumber
    | z.ZodString
    | z.ZodBoolean
    | z.ZodEnum<[string, ...string[]]>
    | undefined {
    if (t instanceof z.ZodUnion) {
        const options: z.ZodTypeAny[] = t._def.options
        return options.find(isPlainType)
    }
    if (isPlainType(t)) {
        return t
    }
    return undefined
}

export function createReflectInspector<T extends z.ZodObject<any>>(
    title: string,
    specific: T,
    titles: TitleOf<z.infer<T>>,
    controls: ControlOf<T> = {},
    order?: Array<keyof z.infer<T>>
): ReflectInspector<T> {
    return ({ data, onChange, title: customTitle, connectedFields }) => {
        const keys = order || Object.keys(specific.shape)
        return (
            <TitledBoard title={customTitle || title}>
                {keys.map((key, index) => {
                    const plainType = getPlainType(specific.shape[key])
                    const title = titles[key] || key
                    if (!plainType) return null

                    const Control =
                        (controls[key] as any) || getControlByType(plainType)
                    if (!Control) return null
                    return (
                        <Control
                            key={key as string}
                            metadata={plainType}
                            data={data && data[key]}
                            title={(title as string) || ''}
                            onChange={(newValue) => {
                                onChange({ ...data, [key]: newValue })
                            }}
                            marginTop={index > 0 ? 8 : 0}
                        ></Control>
                    )
                })}
            </TitledBoard>
        )
    }
}
