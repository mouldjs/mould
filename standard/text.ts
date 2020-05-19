import * as z from 'zod'
import { Layout, Filter, MouseEventHandlers, Shadow } from './common'

export const TextSpecific = z.object({
    content: z.string().optional(),
    color: z.string().optional(),
    weight: z.number().optional(),
    fontStyle: z.union([z.literal('normal'), z.literal('italic')]).optional(),
    size: z.string().optional(),
    letterSpacing: z.string().optional(),
    lineHeight: z.string().optional(),
    horizontalAlign: z.union([
        z.literal('left'),
        z.literal('center'),
        z.literal('right'),
    ]),
    verticalAlign: z.union([
        z.literal('top'),
        z.literal('middle'),
        z.literal('bottom'),
    ]),
})

export const Text = TextSpecific.merge(Layout)
    .merge(Shadow)
    .merge(Filter)
    .merge(MouseEventHandlers)
