import * as z from 'zod'
import { Common } from './common'

export const IconSpecific = z.object({
    name: z.string().optional(),
    namespace: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
})

export const Icon = IconSpecific.merge(Common)
