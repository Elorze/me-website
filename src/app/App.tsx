import { useMemo, useRef, useState } from 'react'
import { FogDissipate } from '@/components/hero/FogDissipate'
import { ProjectArchive } from '@/components/projects/ProjectArchive'
import { useFogTransition } from '@/lib/hooks/useFogTransition'
import { usePointerParallax } from '@/lib/hooks/usePointerParallax'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { HomePage } from '@/pages/HomePage'

type View = 'home' | 'projects'

/**
 * App shell with mist veil between home and project archive.
 */
export function App() {
  const reduced = usePrefersReducedMotion()
  const { fog, run, busy } = useFogTransition(reduced)
  const [view, setView] = useState<View>('home')
  const [staging, setStaging] = useState<View | null>(null)
  const visitedArchive = useRef(false)
  const parallax = usePointerParallax({ strength: 0.65, ease: 0.1 })
  const mouse = useMemo(
    () => ({ x: parallax.x, y: -parallax.y }),
    [parallax.x, parallax.y],
  )

  const go = (next: View) => {
    if (next === view || busy) return
    run({
      onBegin: () => {
        if (next === 'projects') visitedArchive.current = true
        setStaging(next)
      },
      onCovered: () => {
        setView(next)
        setStaging(null)
      },
    })
  }

  const mountHome = view === 'home' || staging === 'home'
  const mountProjects = view === 'projects' || staging === 'projects'
  const homeActive = view === 'home'
  const projectsActive = view === 'projects'

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      {mountHome && (
        <div
          className="absolute inset-0"
          style={{
            opacity: homeActive ? 1 : 0,
            zIndex: homeActive ? 1 : 0,
            pointerEvents: homeActive && !busy ? 'auto' : 'none',
          }}
          aria-hidden={!homeActive}
        >
          <HomePage
            onOpenProjects={() => go('projects')}
            skipIntro={visitedArchive.current}
          />
        </div>
      )}

      {mountProjects && (
        <div
          className="absolute inset-0"
          style={{
            opacity: projectsActive ? 1 : 0,
            zIndex: projectsActive ? 1 : 0,
            pointerEvents: projectsActive && !busy ? 'auto' : 'none',
          }}
          aria-hidden={!projectsActive}
        >
          <ProjectArchive visible={projectsActive} onHome={() => go('home')} />
        </div>
      )}

      {fog.active && (
        <div className="fixed inset-0 z-[80]" style={{ pointerEvents: 'auto' }} aria-hidden>
          <FogDissipate
            mouse={mouse}
            clear={fog.clear}
            veil={fog.veil}
            reduced={reduced}
          />
        </div>
      )}
    </div>
  )
}
