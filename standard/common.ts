import * as z from 'zod'

const Initial = z.object({})

function zEventHandler<T extends z.ZodType<any>>(eventType: T) {
    return z.function(z.tuple([eventType]), z.any())
}

export function pickEventHandlers<
    T extends z.ZodObject<
        {
            [key in string]: z.ZodUnion<
                [z.ZodFunction<z.ZodTuple<[any]>, z.ZodAny>, z.ZodUndefined]
            >
        }
    >,
    U extends z.infer<T>
>(
    eventHandelerDefinition: T,
    props: U,
    wrapper?: <V>(func: V) => V
): z.infer<T> {
    const keys = Object.keys(eventHandelerDefinition.shape)
    const obj = {}
    if (wrapper) {
        keys.forEach((key) => {
            obj[key] = wrapper(props[key])
        })
    } else {
        keys.forEach((key) => {
            obj[key] = props[key]
        })
    }
    return obj
}

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
    flexGrow: z.string().optional(),
    flexShrink: z.string().optional(),
    left: z.string().optional(),
    top: z.string().optional(),
    right: z.string().optional(),
    bottom: z.string().optional(),
    position: z
        .union([
            z.literal('absolute'),
            z.literal('fixed'),
            z.literal('relative'),
            z.literal('static'),
            z.literal('sticky'),
        ])
        .optional(),
})

export const BaseEvent = z.object({
    nativeEvent: z.any(),
    currentTarget: z.any(),
    target: z.any(),
    bubbles: z.boolean(),
    cancelable: z.boolean(),
    defaultPrevented: z.boolean(),
    eventPhase: z.number(),
    isTrusted: z.boolean(),
    preventDefault: z.function(z.tuple([]), z.undefined()),
    isDefaultPrevented: z.function(z.tuple([]), z.boolean()),
    stopPropagation: z.function(z.tuple([]), z.undefined()),
    isPropagationStopped: z.function(z.tuple([]), z.boolean()),
    persist: z.function(z.tuple([]), z.undefined()),
    timeStamp: z.number(),
    type: z.string(),
})

export const CommonMouseEvent = BaseEvent.augment({
    altKey: z.boolean(),
    button: z.number(),
    buttons: z.number(),
    clientX: z.number(),
    clientY: z.number(),
    ctrlKey: z.boolean(),
    metaKey: z.boolean(),
    movementX: z.number(),
    movementY: z.number(),
    pageX: z.number(),
    pageY: z.number(),
    relatedTarget: z.any(),
    screenX: z.number(),
    screenY: z.number(),
    shiftKey: z.boolean(),
    type: z.number(),
})

const DefaultMouseEventHandler = zEventHandler(CommonMouseEvent)

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

export const CommonKeyEvent = BaseEvent.augment({
    altKey: z.boolean(),
    charCode: z.number(),
    ctrlKey: z.boolean(),
    key: z.string(),
    keyCode: z.number(),
    locale: z.string(),
    location: z.number(),
    metaKey: z.boolean(),
    repeat: z.boolean(),
    shiftKey: z.boolean(),
    which: z.number(),
})

const DefaultKeyEventHandler = zEventHandler(CommonKeyEvent)

const OptionalDefaultKeyEventHandler = DefaultKeyEventHandler.optional()

export const KeyEventHandlers = z.object({
    onKeyDown: OptionalDefaultKeyEventHandler,
    onKeyDownCapture: OptionalDefaultKeyEventHandler,
    onKeyPress: OptionalDefaultKeyEventHandler,
    onKeyPressCapture: OptionalDefaultKeyEventHandler,
    onKeyUp: OptionalDefaultKeyEventHandler,
    onKeyUpCapture: OptionalDefaultKeyEventHandler,
})

const DefaultFormEventHandler = zEventHandler(BaseEvent)
const OptionalDefaultFormEventHandler = DefaultFormEventHandler.optional()
export const FormEventHandlers = z.object({
    onChange: OptionalDefaultFormEventHandler,
    onChangeCapture: OptionalDefaultFormEventHandler,
    onBeforeInput: OptionalDefaultFormEventHandler,
    onBeforeInputCapture: OptionalDefaultFormEventHandler,
    onInput: OptionalDefaultFormEventHandler,
    onInputCapture: OptionalDefaultFormEventHandler,
    onReset: OptionalDefaultFormEventHandler,
    onResetCapture: OptionalDefaultFormEventHandler,
    onSubmit: OptionalDefaultFormEventHandler,
    onSubmitCapture: OptionalDefaultFormEventHandler,
    onInvalid: OptionalDefaultFormEventHandler,
    onInvalidCapture: OptionalDefaultFormEventHandler,
})

export const Common = Initial.merge(Fill)
    .merge(Border)
    .merge(Filter)
    .merge(Shadow)
    .merge(Layout)
    .merge(MouseEventHandlers)
    .merge(KeyEventHandlers)
