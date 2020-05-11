import z from 'zod'
import { Stack } from './stack'

export type StackProps = z.infer<typeof Stack>

export { Stack }
