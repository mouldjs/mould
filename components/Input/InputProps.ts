import * as z from 'zod'
import {
    Layout,
    Filter,
    MouseEventHandlers,
    Shadow,
} from '../../standard/common'

export const InputSpecific = z.object({
    value: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
})

export const Input = InputSpecific.merge(Layout)
    .merge(Shadow)
    .merge(Filter)
    .merge(MouseEventHandlers)

export type InputProps = z.infer<typeof Input>
