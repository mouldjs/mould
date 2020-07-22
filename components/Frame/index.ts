import { Layers } from 'react-feather'
import Stack, { transform, transformChildrenProps } from './Frame'
import { RawFrame } from './RawFrame'
import { Stack as StackStandard } from '../../standard'
import { FrameChildrenInspectorRenderer } from './Inspector'
import { FrameChildrenMoveable } from './ChildrenMoveable'

export const Editable = Stack

export const Raw = RawFrame

export const Icon = Layers

export const Standard = StackStandard

export const Transform = transform

export const acceptChildren = true

export const ChildrenTransform = transformChildrenProps

export const ChildrenInspectorRenderer = FrameChildrenInspectorRenderer

export const ChildrenMoveable = FrameChildrenMoveable
