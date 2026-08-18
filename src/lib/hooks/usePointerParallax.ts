import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type ParallaxOffset = {
  x: number
  y: number
}

type Options = {
  /** Max translate in % of the layer size */
  strength?: number
  /** Lerp factor per frame (0–1) */
  ease?: number
}

/**
 * Smooth pointer / device-tilt parallax.
 * Returns normalized offsets roughly in [-1, 1].
 */
export function usePointerParallax({
  strength = 1,
  ease = 0.06,
}: Options = {}) {
  const reduced = usePrefersReducedMotion()
  const target = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 })
  const current = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    if (reduced) {
      target.current = { x: 0, y: 0 }
      current.current = { x: 0, y: 0 }
      setOffset({ x: 0, y: 0 })
      return
    }

    const onPointer = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      target.current = { x: nx * strength, y: ny * strength }
    }

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return
      const nx = Math.max(-1, Math.min(1, event.gamma / 30))
      const ny = Math.max(-1, Math.min(1, (event.beta - 45) / 30))
      target.current = { x: nx * strength * 0.7, y: ny * strength * 0.7 }
    }

    const tick = () => {
      const cx = current.current.x
      const cy = current.current.y
      const nx = cx + (target.current.x - cx) * ease
      const ny = cy + (target.current.y - cy) * ease
      current.current = { x: nx, y: ny }

      if (Math.abs(nx - cx) > 0.0001 || Math.abs(ny - cy) > 0.0001) {
        setOffset({ x: nx, y: ny })
      }

      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('deviceorientation', onOrientation, { passive: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onOrientation)
      cancelAnimationFrame(raf.current)
    }
  }, [ease, reduced, strength])

  return offset
}
