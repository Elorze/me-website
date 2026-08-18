import { useCallback, useEffect, useRef, useState } from 'react'

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

type RunArgs = {
  /** Fire immediately — mount the destination under the rising fog */
  onBegin?: () => void
  onCovered: () => void
  onDone?: () => void
}

type FogState = {
  active: boolean
  clear: number
  veil: number
}

const COVER_MS = 1200
const HOLD_MS = 220
const CLEAR_MS = 1700

/**
 * Cloud appear → swap view at peak → dissipate.
 */
export function useFogTransition(reduced: boolean) {
  const [fog, setFog] = useState<FogState>({
    active: false,
    clear: 1,
    veil: 0,
  })
  const busyRef = useRef(false)
  const rafRef = useRef(0)
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
    cancelAnimationFrame(rafRef.current)
  }

  useEffect(() => () => clearTimers(), [])

  const run = useCallback(
    ({ onBegin, onCovered, onDone }: RunArgs) => {
      if (busyRef.current) return false

      if (reduced) {
        onBegin?.()
        onCovered()
        onDone?.()
        return true
      }

      busyRef.current = true
      clearTimers()
      onBegin?.()
      setFog({ active: true, clear: 1, veil: 0 })

      const t0 = performance.now()

      const coverTick = (now: number) => {
        const t = Math.min(1, (now - t0) / COVER_MS)
        const e = easeInOutCubic(t)
        setFog({
          active: true,
          clear: 1 - e,
          veil: e,
        })
        if (t < 1) {
          rafRef.current = requestAnimationFrame(coverTick)
          return
        }

        const holdId = window.setTimeout(() => {
          onCovered()
          const clearStart = performance.now()

          const clearTick = (n: number) => {
            const ct = Math.min(1, (n - clearStart) / CLEAR_MS)
            const ce = easeInOutCubic(ct)
            setFog({
              active: true,
              clear: ce,
              veil: Math.max(0, 1 - ce * 0.4),
            })
            if (ct < 1) {
              rafRef.current = requestAnimationFrame(clearTick)
              return
            }
            setFog({ active: false, clear: 1, veil: 0 })
            busyRef.current = false
            onDone?.()
          }

          rafRef.current = requestAnimationFrame(clearTick)
        }, HOLD_MS)
        timersRef.current.push(holdId)
      }

      rafRef.current = requestAnimationFrame(coverTick)
      return true
    },
    [reduced],
  )

  return { fog, run, busy: fog.active }
}
