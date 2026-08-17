import { useEffect, useMemo, useState } from 'react'
import { usePointerParallax } from '@/lib/hooks/usePointerParallax'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { DepthParallaxStage } from './DepthParallaxStage'
import { SceneCursor } from './SceneCursor'

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/**
 * Immersive Guilin hero:
 * black hold → doorway aperture → soft full-frame dawn → photo brightness.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion()
  const parallax = usePointerParallax({ strength: 1, ease: 0.07 })
  const [intro, setIntro] = useState(reduced ? 1 : 0)
  const [sunrise, setSunrise] = useState(reduced ? 1 : 0)

  const mouse = useMemo(
    () => ({ x: parallax.x, y: -parallax.y }),
    [parallax.x, parallax.y],
  )

  useEffect(() => {
    if (reduced) {
      setIntro(1)
      setSunrise(1)
      return
    }

    // black → open door → soft dawn wash across the frame → settle
    const totalMs = 8800
    const blackHold = 0.1
    const openEnd = 0.45
    const dawnStart = 0.34
    const t0 = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / totalMs)

      const openT = Math.min(1, Math.max(0, (t - blackHold) / (openEnd - blackHold)))
      setIntro(easeInOutCubic(openT))

      const dawnT = Math.min(1, Math.max(0, (t - dawnStart) / (1 - dawnStart)))
      setSunrise(easeInOutCubic(dawnT))

      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <DepthParallaxStage
          mouse={mouse}
          intro={intro}
          sunrise={sunrise}
          reduced={reduced}
        />
      </div>
      <SceneCursor enabled={!reduced && intro > 0.35} />
    </section>
  )
}
