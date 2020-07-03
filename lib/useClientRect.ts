import { useCallback, useState, useEffect } from 'react'

function useClientRect(): [
    ClientRect | undefined,
    (node: HTMLDivElement) => void
] {
    const [rect, setRect] = useState<ClientRect>()
    const [node, setNode] = useState<HTMLDivElement>()

    const ref = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setNode(node)
        }
    }, [])
    useEffect(() => {
        function resizeListener() {
            if (node) {
                setRect(node.getBoundingClientRect())
            }
        }
        if (node) {
            setRect(node.getBoundingClientRect())
            window.addEventListener('resize', resizeListener)
        }
        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [node])

    return [rect, ref]
}

export default useClientRect
