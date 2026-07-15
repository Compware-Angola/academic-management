import { useEffect, useRef, useState } from "react"

const INACTIVITY_TIMEOUT = 1000 * 60 * 2
export function useUserActivity(timeout = INACTIVITY_TIMEOUT) {
    const [isActive, setIsActive] = useState(true)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const resetTimer = () => {
            setIsActive(true)

            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            timerRef.current = setTimeout(() => {
                setIsActive(false)
            }, timeout)
        }

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ] as const

        resetTimer()

        events.forEach((event) =>
            window.addEventListener(event, resetTimer, {
                passive: true,
            }),
        )

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            events.forEach((event) =>
                window.removeEventListener(event, resetTimer),
            )
        }
    }, [timeout])

    return isActive
}