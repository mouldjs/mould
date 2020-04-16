export const createTick = <TickData = any>(
    onTickEnd: (data: TickData) => void
) => {
    let tickData,
        tickOn = false

    return function tick(mutTickData: (data: TickData) => TickData) {
        if (!tickOn) {
            tickOn = true
            requestAnimationFrame(() => {
                tickOn = false
                onTickEnd(tickData)
                tickData = undefined
            })
        }
        tickData = mutTickData(tickData)
    }
}
