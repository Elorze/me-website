import { useEffect, type CSSProperties } from 'react'
import { displayFont, ui } from '@/content/theme'

type Props = {
  open: boolean
  src: string | null
  title?: string
  onClose: () => void
}

const closeBtn: CSSProperties = {
  fontFamily: displayFont,
  fontSize: '0.88rem',
  color: ui.goldSoft,
  letterSpacing: '0.2em',
  padding: '0.55rem 1.35rem',
  paddingRight: 'calc(1.35rem + 0.2em)',
  background: 'rgba(10, 6, 4, 0.85)',
  border: `1px solid ${ui.ivoryBorder}`,
  borderRadius: 1,
}

/**
 * Fullscreen video player overlay — Escape / 关闭 to dismiss.
 */
export function VideoPlayer({ open, src, title, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !src) return null

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(5, 3, 2, 0.94)' }}
      role="dialog"
      aria-modal
      aria-label={title ?? '视频播放'}
    >
      <header className="flex shrink-0 items-center justify-between px-6 py-5 sm:px-10">
        <p
          className="m-0"
          style={{
            fontFamily: displayFont,
            fontSize: '0.9rem',
            color: ui.goldSoft,
            letterSpacing: '0.18em',
          }}
        >
          {title ?? '视觉视频'}
        </p>
        <button
          type="button"
          className="ui-interactive transition-opacity hover:opacity-80"
          style={closeBtn}
          onClick={onClose}
        >
          关闭
        </button>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-10">
        <video
          key={src}
          src={src}
          controls
          autoPlay
          playsInline
          className="max-h-full max-w-full"
          style={{
            width: 'min(1100px, 100%)',
            background: '#000',
            boxShadow: '0 0 0 1px rgba(245, 236, 220, 0.12)',
          }}
        />
      </div>
    </div>
  )
}
