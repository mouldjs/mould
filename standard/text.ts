import * as z from 'zod'
import { Layout, Filter, MouseEventHandlers } from './common'

export const TextSpecific = z.object({
    content: z.string().optional(),
    color: z.string().optional(),
    typeface: z.string().optional(),
    weight: z.string().optional(),
    shadow: z.string().optional(),
    style: z.union([z.literal('normal'), z.literal('italic')]).optional(),
    decorationLine: z
        .union([z.literal('underline'), z.literal('through')])
        .optional(),
    decorationStyle: z
        .union([z.literal('wavy'), z.literal('solid'), z.literal('dashed')])
        .optional(),
    decorationColor: z.string().optional(),
    decorationThickness: z.string().optional(),
})

export const Text = TextSpecific.merge(Layout)
    .merge(Filter)
    .merge(MouseEventHandlers)
