import { useEffect, useMemo, useState } from 'react'
import { usePointerParallax } from '@/lib/hooks/usePointerParallax'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { DepthParallaxStage } from './DepthParallaxStage'
import { ProjectsEntry } from './ProjectsEntry'
import { SceneCursor } from './SceneCursor'

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/** Leave the tiny center ring quickly; keep mid/late sweep pace similar. */
function easeDawnRing(t: number) {
  const eased = easeInOutCubic(t)
  return Math.pow(eased, 0.58)
}

type Props = {
  onOpenProjects?: () => void
  /** Skip doorway / dawn when returning from archive */
  skipIntro?: boolean
}

/**
 * Immersive Guilin hero:
 * brief black → doorway + light ring → quiet projects entry.
 */
export function HeroScene({ onOpenProjects, skipIntro = false }: Props) {
  const reduced = usePrefersReducedMotion()
  const parallax = usePointerParallax({ strength: 1, ease: 0.07 })
  const startSettled = reduced || skipIntro
  const [intro, setIntro] = useState(startSettled ? 1 : 0)
  const [sunrise, setSunrise] = useState(startSettled ? 1 : 0)
  const [entryVisible, setEntryVisible] = useState(startSettled)

  const mouse = useMemo(
    () => ({ x: parallax.x, y: -parallax.y }),
    [parallax.x, parallax.y],
  )

  useEffect(() => {
    if (startSettled) {
      setIntro(1)
      setSunrise(1)
      setEntryVisible(true)
      return
    }

    const totalMs = 8200
    const blackHold = 0.06
    const openEnd = 0.48
    const dawnStart = blackHold
    const t0 = performance.now()
    let raf = 0
    let entryTimer: number | undefined
    let entryArmed = false

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / totalMs)

      const openT = Math.min(1, Math.max(0, (t - blackHold) / (openEnd - blackHold)))
      setIntro(easeInOutCubic(openT))

      const dawnT = Math.min(1, Math.max(0, (t - dawnStart) / (1 - dawnStart)))
      const dawn = easeDawnRing(dawnT)
      setSunrise(dawn)

      if (!entryArmed && dawn >= 0.92) {
        entryArmed = true
        entryTimer = window.setTimeout(() => setEntryVisible(true), 420)
      }

      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (entryTimer !== undefined) window.clearTimeout(entryTimer)
    }
  }, [startSettled])

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
      <ProjectsEntry visible={entryVisible} onOpenProjects={onOpenProjects} />
      <SceneCursor enabled={!reduced && intro > 0.35} />
    </section>
  )
}
