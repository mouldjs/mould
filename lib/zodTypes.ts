import * as z from 'zod'

export const stringOrNumber = z.union([z.string(), z.number()])

export const Space = z.object({
    margin: stringOrNumber.optional(),
    marginTop: stringOrNumber.optional(),
    marginRight: stringOrNumber.optional(),
    marginBottom: stringOrNumber.optional(),
    marginLeft: stringOrNumber.optional(),
    padding: stringOrNumber.optional(),
    paddingTop: stringOrNumber.optional(),
    paddingRight: stringOrNumber.optional(),
    paddingBottom: stringOrNumber.optional(),
    paddingLeft: stringOrNumber.optional(),
})

export const Color = z.object({
    color: z.string().optional(),
    opacity: z.string().optional(),
})

export const Typography = z.object({
    fontFamily: z.string().optional(),
    fontSize: stringOrNumber.optional(),
    fontWeight: z.number().optional(),
    lineHeight: stringOrNumber.optional(),
    letterSpacing: stringOrNumber.optional(),
    textAlign: z
        .union([
            z.literal('center'),
            z.literal('end'),
            z.literal('justify'),
            z.literal('left'),
            z.literal('match-parent'),
            z.literal('right'),
            z.literal('start'),
        ])
        .optional(),
    fontStyle: z
        .union([z.literal('italic'), z.literal('normal'), z.literal('oblique')])
        .optional(),
})

export const Layout = z.object({
    width: stringOrNumber.optional(),
    minWidth: stringOrNumber.optional(),
    maxWidth: stringOrNumber.optional(),
    height: stringOrNumber.optional(),
    minHeight: stringOrNumber.optional(),
    maxHeight: stringOrNumber.optional(),
    display: z.string().optional(),
    overflow: z.string().optional(),
    overflowX: z.string().optional(),
    overflowY: z.string().optional(),
})

export const Background = z.object({
    background: z.string().optional(),
})

export const Border = z.object({
    border: z.string().optional(),
})

//TODO fix events
export const Events = z.object({
    onClick: z.string().optional(),
    onHover: z.string().optional(),
})

export const CSSProperties = Space.merge(Color)
    .merge(Typography)
    .merge(Layout)
    .merge(Background)
    .merge(Border)

export const DOMAttributes = Events.merge(CSSProperties)
