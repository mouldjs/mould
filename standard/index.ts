import z from 'zod'
import { Stack } from './stack'
import { Text } from './text'

export type StackProps = z.infer<typeof Stack>
export type TextProps = z.infer<typeof Text>

export { Stack, Text }
