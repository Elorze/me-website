import { useEffect, useMemo, useState } from 'react'
import { usePointerParallax } from '@/lib/hooks/usePointerParallax'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { DepthParallaxStage } from './DepthParallaxStage'
import { FogDissipate } from './FogDissipate'
import { SceneCursor } from './SceneCursor'

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

/**
 * Immersive Guilin hero:
 * dense fog on entry → parting clouds → depth parallax landscape.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion()
  const parallax = usePointerParallax({ strength: 1, ease: 0.07 })
  const [clear, setClear] = useState(reduced ? 1 : 0)
  const [intro, setIntro] = useState(reduced ? 1 : 0)
  const [ready, setReady] = useState(false)

  const mouse = useMemo(
    () => ({ x: parallax.x, y: -parallax.y }),
    [parallax.x, parallax.y],
  )

  useEffect(() => {
    setReady(true)
    if (reduced) {
      setClear(1)
      setIntro(1)
      return
    }

    const fogDuration = 4200
    const introDuration = 2600
    const t0 = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const fogT = Math.min(1, (now - t0) / fogDuration)
      const introT = Math.min(1, (now - t0) / introDuration)
      // Hold dense fog briefly, then part
      const held = Math.max(0, (fogT - 0.12) / 0.88)
      setClear(easeOutCubic(held))
      setIntro(easeOutCubic(introT))
      if (fogT < 1 || introT < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          opacity: ready ? 1 : 0,
          transition: reduced ? undefined : 'opacity 0.8s ease-out',
        }}
      >
        <DepthParallaxStage mouse={mouse} intro={intro} reduced={reduced} />
        <FogDissipate mouse={mouse} clear={clear} reduced={reduced} />
      </div>
      <SceneCursor enabled={!reduced} />
    </section>
  )
}
