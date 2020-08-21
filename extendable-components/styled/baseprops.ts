import {
    SpaceProps,
    ColorProps,
    LayoutProps,
    TypographyProps,
    FlexboxProps,
    PositionProps,
    BorderProps,
    borderColor,
} from 'styled-system'
import * as z from 'zod'
import { BorderPropTypes } from '../../inspector/Border'
import { LayoutPropTypes, layoutSizeToString } from '../../inspector/Layout'
import { FillPropTypes } from '../../inspector/Fill'
import { transformColorToStr } from '../../inspector/Color'
import { transformBorderProps as orgTransformBorderProps } from '../../inspector/Border'
import { nameToParam } from '../../app/utils'
import { ContainerLayoutProps } from '../../inspector/InspectorProvider'

export type BaseComponentProps = {
    containerLayoutProps?: ContainerLayoutProps
    layoutProps?: LayoutPropTypes
    borderProps?: BorderPropTypes
    fillProps?: FillPropTypes
}

export function transformBorderProps({
    borderProps,
    layoutProps,
}: BaseComponentProps): BorderProps {
    let res: BorderProps = orgTransformBorderProps(borderProps)
    if (layoutProps) {
        const { radius } = layoutProps
        const radiusStr =
            typeof radius === 'object'
                ? `${radius.t}px ${radius.r}px ${radius.b}px ${radius.l}px`
                : `${radius}px`
        res = { ...res, borderRadius: radiusStr }
    }
    return res
}

export function transformLayoutProps({
    layoutProps,
}: BaseComponentProps): LayoutProps {
    let res: LayoutProps = {}
    if (layoutProps) {
        const { width, height, overflow } = layoutProps
        res = {
            ...res,
            width: layoutSizeToString(width),
            height: layoutSizeToString(height),
            overflow: nameToParam(overflow),
        }
    }
    return res
}

export function transformColorProps({
    fillProps,
    layoutProps,
}: BaseComponentProps): ColorProps {
    return {
        opacity: layoutProps?.opacity,
        backgroundColor:
            (fillProps &&
                fillProps.active &&
                transformColorToStr(fillProps.color)) ||
            undefined,
        // backgroundColor:
        // color
    }
}

export function transformBaseComponentProps(
    props: BaseComponentProps
): BorderProps & LayoutProps & ColorProps {
    return {
        ...transformBorderProps(props),
        ...transformLayoutProps(props),
        ...transformColorProps(props),
    }
}
