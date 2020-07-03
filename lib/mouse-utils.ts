import { FullGestureState } from 'react-use-gesture/dist/types'

interface ExtendedWheelEvent extends WheelEvent {
    wheelDelta?: number
    wheelDeltaX?: number
    wheelDeltaY?: number
}

export function wheelEventType(
    event: ExtendedWheelEvent
): 'mousewheel' | 'touchpad' {
    const { deltaX, deltaY } = event
    if (
        deltaY * -3 === event.wheelDeltaY ||
        Math.abs(deltaX) >= Math.abs(deltaY)
    ) {
        return 'touchpad'
    }
    return 'mousewheel'
}

export function getPinchGestureEventSource(
    event: FullGestureState<'pinch'>
): 'mousewheel' | 'touchpad' {
    event.event?.persist()
    const nativeEvent = event.event?.nativeEvent
    if (nativeEvent instanceof WheelEvent) {
        if (wheelEventType(nativeEvent) === 'mousewheel') {
            return 'mousewheel'
        }
    }
    return 'touchpad'
}
