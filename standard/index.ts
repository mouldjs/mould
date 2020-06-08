import z from 'zod'
import { Stack } from './stack'
import { Text } from './text'
import { Icon } from './icon'

export type StackProps = z.infer<typeof Stack>
export type TextProps = z.infer<typeof Text>

export type IconProps = z.infer<typeof Icon>

export { Stack, Text, Icon }
