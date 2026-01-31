import { useEffect, useState } from "react"

type TWindowSize = {
    width: number,
    height: number
}

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<TWindowSize>({
        width: 0,
        height: 0
    })

    useEffect(() => {
        function handleWindowSize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerWidth
            })
        }

        handleWindowSize()
        window.addEventListener("resize", handleWindowSize)

        return () => window.removeEventListener("resize", handleWindowSize)
    }, [])

    return windowSize
}
