import * as z from 'zod'
import { Common } from './common'

export const StackSpecific = z.object({
    flexDirection: z.union([z.literal('column'), z.literal('row')]).optional(),
    justifyContent: z
        .union([
            z.literal('flex-start'),
            z.literal('center'),
            z.literal('flex-end'),
            z.literal('space-between'),
            z.literal('space-around'),
            z.literal('space-evenly'),
        ])
        .optional(),
    alignItem: z
        .union([
            z.literal('flex-start'),
            z.literal('center'),
            z.literal('flex-end'),
        ])
        .optional(),
    gap: z.string().optional(),
    padding: z.string().optional(),
    paddingTop: z.string().optional(),
    paddingRight: z.string().optional(),
    paddingBottom: z.string().optional(),
    paddingLeft: z.string().optional(),
})

export const Stack = StackSpecific.merge(Common)
