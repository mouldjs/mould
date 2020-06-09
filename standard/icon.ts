import * as z from 'zod'
import { Filter, Shadow, MouseEventHandlers } from './common'

export const IconSpecific = z.object({
    name: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
})

export const Icon = IconSpecific.merge(Filter)
    .merge(Shadow)
    .merge(MouseEventHandlers)
