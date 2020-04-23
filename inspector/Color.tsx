import React, { useState, useEffect } from 'react'
import * as z from 'zod'
import { Popover } from '@blueprintjs/core'
import { ChromePicker } from 'react-color'

const HexColor = z.string()

const HSLColor = z.object({
    h: z.number(),
    s: z.number(),
    l: z.number(),
    a: z.number().optional(),
})

const RGBColor = z.object({
    r: z.number(),
    g: z.number(),
    b: z.number(),
    a: z.number().optional(),
})

export const Color = z.union([HexColor, HSLColor, RGBColor])

export type ColorType = z.infer<typeof Color>

export const transformColorToStr = (color: ColorType): string => {
    if (typeof color === 'object') {
        if (typeof color.a === 'undefined') {
            color.a = 1
        }
        if (color.hasOwnProperty('r')) {
            const rgb = color as z.infer<typeof RGBColor>
            color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
        } else {
            const hsl = color as z.infer<typeof HSLColor>
            color = `hsla(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%, ${hsl.a})`
        }
    }

    return color
}

export const ColorControl = ({
    color = '#000',
    onChange = () => {},
}: {
    color?: ColorType
    onChange?: (color: ColorType) => void
}) => {
    const [localColor, setLocalColor] = useState(color)
    useEffect(() => {
        setLocalColor(color)
    }, [color])

    return (
        <Popover fill targetProps={{ style: { height: '100%' } }}>
            <div
                style={{
                    padding: 4,
                    background: '#fff',
                    borderRadius: 2,
                    display: 'inlin-block',
                    cursor: 'pointer',
                    height: '100%',
                    boxShadow: `0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0), inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2)`,
                }}
            >
                <div
                    style={{
                        background: transformColorToStr(color),
                        borderRadius: 1,
                        height: '100%',
                    }}
                ></div>
            </div>
            <ChromePicker
                color={localColor}
                onChange={(c) => {
                    setLocalColor(c[c.source])
                }}
                onChangeComplete={(c) => {
                    onChange(c[c.source])
                }}
            ></ChromePicker>
        </Popover>
    )
}
