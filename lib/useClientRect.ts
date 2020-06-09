import { useCallback, useState } from 'react'

function useClientRect(): [
    ClientRect | undefined,
    (node: HTMLDivElement) => void
] {
    const [rect, setRect] = useState<ClientRect>()

    const ref = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setRect(node.getBoundingClientRect())
        }
    }, [])

    return [rect, ref]
}

export default useClientRect
