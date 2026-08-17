import { useEffect, useRef, useState } from 'react'

type Props = {
  enabled: boolean
}

/**
 * Glowing ember cursor with a light bird silhouette trail.
 * Falls back to system cursor on coarse pointers / reduced motion.
 */
export function SceneCursor({ enabled }: Props) {
  const [visible, setVisible] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const draw = useRef({ x: 0, y: 0 })
  const birdRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    document.body.classList.add('cursor-none')
    setVisible(true)

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      draw.current.x += (pos.current.x - draw.current.x) * 0.18
      draw.current.y += (pos.current.y - draw.current.y) * 0.18
      const dx = pos.current.x - draw.current.x
      const dy = pos.current.y - draw.current.y
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
      }
      if (birdRef.current) {
        birdRef.current.style.transform = `translate3d(${draw.current.x}px, ${draw.current.y}px, 0) translate(-50%, -50%) rotate(${angle * 0.15}deg)`
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('cursor-none')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [enabled])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 mix-blend-screen" aria-hidden>
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-10 w-10 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,180,80,0.95) 0%, rgba(255,120,40,0.35) 35%, transparent 70%)',
          boxShadow: '0 0 24px rgba(255,140,50,0.55)',
        }}
      />
      <div ref={birdRef} className="absolute left-0 top-0 text-white/90">
        <svg width="28" height="28" viewBox="0 0 64 64" fill="currentColor">
          <path d="M6 34c10-2 18-10 22-18 2 8 8 14 18 16-8 2-14 8-16 18-4-10-12-14-24-16z" />
          <path
            d="M28 18c6-8 14-12 26-12-8 6-12 12-14 20-6-4-10-6-12-8z"
            opacity="0.75"
          />
        </svg>
      </div>
    </div>
  )
}
