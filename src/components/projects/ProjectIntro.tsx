import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { ProjectDeck } from '@/content/deckTypes'
import { displayFont, ui } from '@/content/theme'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

type Props = {
  open: boolean
  onClose: () => void
  deck: ProjectDeck
}

const ghost: CSSProperties = {
  fontFamily: displayFont,
  fontSize: '0.88rem',
  color: ui.goldSoft,
  letterSpacing: '0.2em',
  padding: '0.55rem 1.35rem',
  paddingRight: 'calc(1.35rem + 0.2em)',
  background: 'transparent',
  border: `1px solid ${ui.ivoryBorder}`,
  borderRadius: 1,
}

/**
 * Brand deck as a page — no download, browse like slides.
 * Header / body / footer are stacked so titles stay visible and nav is never covered.
 */
export function ProjectIntro({ open, onClose, deck }: Props) {
  const reduced = usePrefersReducedMotion()
  const slides = deck.slides
  const [index, setIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const slide = slides[index]

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta)))
    },
    [slides.length],
  )

  useEffect(() => {
    if (open) setIndex(0)
  }, [open, deck])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [index, open])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go, onClose])

  if (!open || !slide) return null

  const n = String(index + 1).padStart(2, '0')
  const total = String(slides.length).padStart(2, '0')
  const imageCount = slide.images?.length ?? 0
  const imageOnly =
    Boolean(slide.images?.length) &&
    !slide.kicker &&
    !slide.title &&
    !slide.lead &&
    !slide.columns &&
    !slide.bullets &&
    !slide.body &&
    !slide.note
  const imageMaxH = imageOnly
    ? 'min(72vh, 640px)'
    : imageCount === 1
      ? 'min(34vh, 280px)'
      : imageCount === 2
        ? 'min(30vh, 240px)'
        : 'min(22vh, 160px)'

  return (
    <section
      className="absolute inset-0 z-40 flex flex-col overflow-hidden"
      style={{ background: ui.ink }}
      aria-label={`${deck.brand} 项目介绍`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(180deg, rgba(90, 55, 18, 0.22) 0%, transparent 100%)',
        }}
        aria-hidden
      />
      <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />

      <header className="relative z-10 shrink-0 px-6 pt-6 sm:px-10 sm:pt-8 lg:px-14">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="ui-interactive transition-opacity hover:opacity-80"
            style={ghost}
            onClick={onClose}
          >
            返回
          </button>
          <p
            className="m-0 hidden sm:block"
            style={{
              fontFamily: displayFont,
              fontSize: '0.92rem',
              color: ui.goldSoft,
              letterSpacing: '0.18em',
            }}
          >
            {deck.brand}
            <span style={{ margin: '0 0.5em', opacity: 0.45 }}>/</span>
            项目介绍
          </p>
          <p
            className="m-0"
            style={{
              fontFamily: displayFont,
              fontSize: '0.85rem',
              color: ui.goldSoft,
              letterSpacing: '0.18em',
            }}
          >
            {n} / {total}
          </p>
        </div>
        <div
          className="mt-5 h-px"
          style={{
            background: `linear-gradient(90deg, ${ui.goldLine}, transparent)`,
          }}
          aria-hidden
        />
      </header>

      <div
        ref={scrollRef}
        key={`${deck.brand}-${index}`}
        className={`deck-scroll relative z-10 mx-auto min-h-0 w-full max-w-[1180px] flex-1 overflow-y-auto px-6 py-5 sm:px-10 lg:px-14${
          imageOnly ? ' flex items-center justify-center' : ''
        }`}
        style={{
          animation: reduced
            ? undefined
            : 'archive-copy-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        {slide.kicker && (
          <p
            className="m-0 mb-3"
            style={{
              fontFamily: displayFont,
              fontSize: '0.78rem',
              color: ui.goldSoft,
              letterSpacing: '0.22em',
            }}
          >
            {slide.kicker}
          </p>
        )}
        {slide.title && (
          <h2
            className="m-0 mb-4 max-w-3xl"
            style={{
              fontFamily: displayFont,
              fontSize: slide.closing
                ? 'clamp(1.55rem, 3.2vw, 2.4rem)'
                : 'clamp(1.35rem, 2.6vw, 2rem)',
              fontWeight: 400,
              color: ui.ivory,
              letterSpacing: '0.06em',
              lineHeight: 1.4,
            }}
          >
            {slide.title}
          </h2>
        )}
        {slide.lead && (
          <p
            className="m-0 mb-5 max-w-2xl"
            style={{
              fontFamily: displayFont,
              fontSize: '0.92rem',
              color: ui.ivoryMuted,
              letterSpacing: '0.04em',
              lineHeight: 1.8,
            }}
          >
            {slide.lead}
          </p>
        )}
        {slide.body?.map((line) => (
          <p
            key={line}
            className="m-0 mb-3 max-w-2xl"
            style={{
              fontFamily: displayFont,
              fontSize: '0.92rem',
              color: ui.ivoryMuted,
              letterSpacing: '0.04em',
              lineHeight: 1.8,
            }}
          >
            {line}
          </p>
        ))}

        {slide.columns && (
          <div
            className="mt-2 grid gap-3"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
            }}
          >
            {slide.columns.map((col) => (
              <div
                key={col.heading}
                className="px-4 py-3.5"
                style={{
                  border: `1px solid ${ui.goldLine}`,
                  background: 'rgba(255,252,245,0.02)',
                }}
              >
                <p
                  className="m-0 mb-2.5"
                  style={{
                    fontFamily: displayFont,
                    color: ui.goldSoft,
                    letterSpacing: '0.12em',
                    fontSize: '0.82rem',
                  }}
                >
                  {col.heading}
                </p>
                <ul className="m-0 list-none p-0">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="mb-1.5"
                      style={{
                        fontFamily: displayFont,
                        color: ui.ivoryMuted,
                        fontSize: '0.84rem',
                        lineHeight: 1.6,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {slide.bullets && (
          <ul className="m-0 mb-4 max-w-2xl list-none p-0">
            {slide.bullets.map((item) => (
              <li
                key={item}
                className="mb-2 flex gap-3"
                style={{
                  fontFamily: displayFont,
                  color: ui.ivoryMuted,
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  letterSpacing: '0.03em',
                }}
              >
                <span style={{ color: ui.goldSoft }}>·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {slide.images && slide.images.length > 0 && (
          <div
            className="mt-2 grid gap-3"
            style={{
              gridTemplateColumns:
                imageCount === 1
                  ? '1fr'
                  : imageCount === 2
                    ? '1fr 1fr'
                    : 'repeat(4, minmax(0, 1fr))',
            }}
          >
            {slide.images.map((img) => (
              <figure key={img.src} className="m-0">
                <div
                  className="overflow-hidden"
                  style={{
                    background: ui.inkRaised,
                    boxShadow: 'inset 0 0 0 1px rgba(245, 236, 220, 0.08)',
                    maxHeight: imageMaxH,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? ''}
                    className="h-full w-full object-contain"
                    style={{
                      maxHeight: imageMaxH,
                      width: '100%',
                      background: '#0c0a08',
                    }}
                  />
                </div>
                {img.caption && (
                  <figcaption
                    className="mt-2"
                    style={{
                      fontFamily: displayFont,
                      fontSize: '0.72rem',
                      color: ui.ivoryMuted,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {slide.note && (
          <p
            className="m-0 mt-5"
            style={{
              fontFamily: displayFont,
              fontSize: '0.82rem',
              color: ui.goldSoft,
              letterSpacing: '0.08em',
              lineHeight: 1.7,
            }}
          >
            {slide.note}
          </p>
        )}
      </div>

      <footer
        className="relative z-20 flex shrink-0 items-center justify-center gap-4 px-6 py-4 sm:px-10"
        style={{
          borderTop: `1px solid ${ui.goldLine}`,
          background:
            'linear-gradient(180deg, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.96) 40%)',
        }}
      >
        <button
          type="button"
          className="ui-interactive transition-opacity hover:opacity-80 disabled:opacity-30"
          style={{
            ...ghost,
            background: 'rgba(10, 6, 4, 0.85)',
          }}
          disabled={index === 0}
          onClick={() => go(-1)}
        >
          上一页
        </button>
        <button
          type="button"
          className="ui-interactive transition-opacity hover:opacity-80 disabled:opacity-30"
          style={{
            ...ghost,
            background: 'rgba(10, 6, 4, 0.85)',
          }}
          disabled={index === slides.length - 1}
          onClick={() => go(1)}
        >
          下一页
        </button>
      </footer>
    </section>
  )
}
