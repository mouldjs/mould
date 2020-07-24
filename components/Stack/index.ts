import { Layers } from 'react-feather'
import Stack, { transform, transformChildrenStyle } from './Stack'
import { RawStack } from './RawStack'
import { Stack as StackStandard } from '../../standard'
import { StackChildrenInspectorRenderer } from './Inspector'
import { StackChildrenMoveable } from './ChildrenMoveable'

export const Editable = Stack

export const Raw = RawStack

export const Icon = Layers

export const Standard = StackStandard

export const Transform = transform

export const acceptChildren = true

export const ChildrenTransform = transformChildrenStyle

export const ChildrenInspectorRenderer = StackChildrenInspectorRenderer

export const ChildrenMoveable = StackChildrenMoveable
