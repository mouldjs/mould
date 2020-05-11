import * as z from 'zod'

const Initial = z.object({})

export const Shadow = z.object({
    shadow: z.string().optional(),
})

export const Filter = z.object({
    filter: z.string().optional(),
    backdropFilter: z.string().optional(),
})

export const Border = z.object({
    borderWidth: z.string().optional(),
    borderStyle: z
        .union([
            z.literal('solid'),
            z.literal('dashed'),
            z.literal('dotted'),
            z.literal('double'),
        ])
        .optional(),
    borderColor: z.string().optional(),
})

export const Fill = z.object({
    fill: z.string().optional(),
})

export const Layout = z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    overflow: z.union([z.literal('visible'), z.literal('hidden')]).optional(),
    opacity: z.string().optional(),
    radius: z.string().optional(),
})

export const CommonMouseEvent = z.object({
    stopPropagation: z.function(z.tuple([]), z.undefined()),
})

const DefaultMouseEventHandler = z.function(
    z.tuple([CommonMouseEvent]),
    z.undefined()
)

const OptionalDefaultMouseEventHandler = DefaultMouseEventHandler.optional()

export const MouseEventHandlers = z.object({
    onClick: OptionalDefaultMouseEventHandler,
    onClickCapture: OptionalDefaultMouseEventHandler,
    onContextMenu: OptionalDefaultMouseEventHandler,
    onContextMenuCapture: OptionalDefaultMouseEventHandler,
    onDoubleClick: OptionalDefaultMouseEventHandler,
    onDoubleClickCapture: OptionalDefaultMouseEventHandler,
    onMouseDown: OptionalDefaultMouseEventHandler,
    onMouseDownCapture: OptionalDefaultMouseEventHandler,
    onMouseEnter: OptionalDefaultMouseEventHandler,
    onMouseLeave: OptionalDefaultMouseEventHandler,
    onMouseMove: OptionalDefaultMouseEventHandler,
    onMouseMoveCapture: OptionalDefaultMouseEventHandler,
    onMouseOut: OptionalDefaultMouseEventHandler,
    onMouseOutCapture: OptionalDefaultMouseEventHandler,
    onMouseOver: OptionalDefaultMouseEventHandler,
    onMouseOverCapture: OptionalDefaultMouseEventHandler,
    onMouseUp: OptionalDefaultMouseEventHandler,
    onMouseUpCapture: OptionalDefaultMouseEventHandler,
})

export const Common = Initial.merge(Fill)
    .merge(Border)
    .merge(Filter)
    .merge(Shadow)
    .merge(Layout)
    .merge(MouseEventHandlers)
