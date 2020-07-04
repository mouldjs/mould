import { FullGestureState } from 'react-use-gesture/dist/types'

interface ExtendedWheelEvent extends WheelEvent {
    wheelDelta?: number
    wheelDeltaX?: number
    wheelDeltaY?: number
}

let zoomContext: 'mousewheel-mac' | 'mousewheel-win' | 'touchpad' = 'touchpad'

export function normalizeZoomFactor(e: FullGestureState<'pinch'>): number {
    let factor = e.delta[1]

    if (e.first && e.event?.type === 'wheel') {
        zoomContext = 'touchpad'

        if (Math.abs(Math.abs(factor) - 4) < 0.0003) {
            // In MacOS Chrome mousewheel first absolute delta always equal 4.00244140625
            zoomContext = 'mousewheel-mac'
        }

        const dividedFactor = factor / (1 / 3)
        if (Math.abs(Math.round(dividedFactor) - dividedFactor) < 0.00004) {
            // In Windows Chrome all mousewheel deltaY is divisible by 1/3
            zoomContext = 'mousewheel-win'
        }
    }

    const direction = factor > 0 ? 1 : factor < 0 ? -1 : 0

    switch (zoomContext) {
        case 'mousewheel-mac':
            return direction * 30
        case 'mousewheel-win':
            return direction * 30
        default:
            return factor
    }
}
