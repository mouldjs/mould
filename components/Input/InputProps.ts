import * as z from 'zod'
import {
    Layout,
    Fill,
    Border,
    Filter,
    Shadow,
    MouseEventHandlers,
    FormEventHandlers,
    KeyEventHandlers,
} from '../../standard/common'

export const InputSpecific = z.object({
    value: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
})

export const Input = InputSpecific.merge(Layout)
    .merge(Fill)
    .merge(Border)
    .merge(Shadow)
    .merge(Filter)
    .merge(MouseEventHandlers)
    .merge(KeyEventHandlers)
    .merge(FormEventHandlers)

export type InputProps = z.infer<typeof Input>
