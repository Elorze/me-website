import { useEffect, useMemo, useState } from 'react'
import { usePointerParallax } from '@/lib/hooks/usePointerParallax'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { DepthParallaxStage } from './DepthParallaxStage'
import { SceneCursor } from './SceneCursor'

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/** Leave the tiny center ring quickly; keep mid/late sweep pace similar. */
function easeDawnRing(t: number) {
  const eased = easeInOutCubic(t)
  return Math.pow(eased, 0.58)
}

/**
 * Immersive Guilin hero:
 * brief black → doorway shadow open AND light-ring expand start together
 * (two different visual forms, synced in time) → settle on photo.
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

    // Two forms, one clock:
    // - intro  → black doorway aperture (shader slits)
    // - sunrise → warm expanding light ring (shader dawn)
    // They START together; each keeps its own easing / duration.
    const totalMs = 8200
    const blackHold = 0.06
    const openEnd = 0.48
    const dawnStart = blackHold
    const t0 = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / totalMs)

      const openT = Math.min(1, Math.max(0, (t - blackHold) / (openEnd - blackHold)))
      setIntro(easeInOutCubic(openT))

      const dawnT = Math.min(1, Math.max(0, (t - dawnStart) / (1 - dawnStart)))
      setSunrise(easeDawnRing(dawnT))

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
