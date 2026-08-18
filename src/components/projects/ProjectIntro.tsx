import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { metaloftDeck } from '@/content/metaloftDeck'
import { displayFont, ui } from '@/content/theme'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

type Props = {
  open: boolean
  onClose: () => void
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
 */
export function ProjectIntro({ open, onClose }: Props) {
  const reduced = usePrefersReducedMotion()
  const slides = metaloftDeck.slides
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta)))
    },
    [slides.length],
  )

  useEffect(() => {
    if (open) setIndex(0)
  }, [open])

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

  return (
    <section
      className="absolute inset-0 z-40 overflow-hidden"
      style={{ background: ui.ink }}
      aria-label="METALOFT 项目介绍"
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

      <header className="relative z-10 flex items-center justify-between px-6 pt-7 sm:px-10 sm:pt-9 lg:px-14">
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
          {metaloftDeck.brand}
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
      </header>

      <div
        className="relative mx-6 mt-5 h-px sm:mx-10 lg:mx-14"
        style={{
          background: `linear-gradient(90deg, ${ui.goldLine}, transparent)`,
        }}
        aria-hidden
      />

      <div
        key={index}
        className="deck-scroll relative z-10 mx-auto flex h-[calc(100%-8.5rem)] w-full max-w-[1180px] flex-col justify-center overflow-y-auto px-6 py-6 sm:px-10 lg:px-14"
        style={{
          animation: reduced
            ? undefined
            : 'archive-copy-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
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
        <h2
          className="m-0 mb-4 max-w-3xl"
          style={{
            fontFamily: displayFont,
            fontSize: slide.closing
              ? 'clamp(1.7rem, 3.6vw, 2.8rem)'
              : 'clamp(1.45rem, 3vw, 2.2rem)',
            fontWeight: 400,
            color: ui.ivory,
            letterSpacing: '0.06em',
            lineHeight: 1.4,
          }}
        >
          {slide.title}
        </h2>
        {slide.lead && (
          <p
            className="m-0 mb-6 max-w-2xl"
            style={{
              fontFamily: displayFont,
              fontSize: '0.95rem',
              color: ui.ivoryMuted,
              letterSpacing: '0.04em',
              lineHeight: 1.85,
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
              fontSize: '0.95rem',
              color: ui.ivoryMuted,
              letterSpacing: '0.04em',
              lineHeight: 1.85,
            }}
          >
            {line}
          </p>
        ))}

        {slide.columns && (
          <div
            className="mt-2 grid gap-4"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
            }}
          >
            {slide.columns.map((col) => (
              <div
                key={col.heading}
                className="px-4 py-4"
                style={{
                  border: `1px solid ${ui.goldLine}`,
                  background: 'rgba(255,252,245,0.02)',
                }}
              >
                <p
                  className="m-0 mb-3"
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
                      className="mb-2"
                      style={{
                        fontFamily: displayFont,
                        color: ui.ivoryMuted,
                        fontSize: '0.86rem',
                        lineHeight: 1.65,
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
          <ul className="m-0 mb-5 max-w-2xl list-none p-0">
            {slide.bullets.map((item) => (
              <li
                key={item}
                className="mb-2.5 flex gap-3"
                style={{
                  fontFamily: displayFont,
                  color: ui.ivoryMuted,
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
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
            className="mt-3 grid gap-3"
            style={{
              gridTemplateColumns:
                slide.images.length === 1
                  ? '1fr'
                  : slide.images.length === 2
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
                    maxHeight: slide.images!.length === 1 ? '42vh' : '28vh',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? ''}
                    className="h-full w-full object-cover"
                    style={{
                      maxHeight: slide.images!.length === 1 ? '42vh' : '28vh',
                      filter: 'saturate(0.92) contrast(1.04)',
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
            className="m-0 mt-6"
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

      <footer className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-4">
        <button
          type="button"
          className="ui-interactive transition-opacity hover:opacity-80 disabled:opacity-30"
          style={ghost}
          disabled={index === 0}
          onClick={() => go(-1)}
        >
          上一页
        </button>
        <button
          type="button"
          className="ui-interactive transition-opacity hover:opacity-80 disabled:opacity-30"
          style={ghost}
          disabled={index === slides.length - 1}
          onClick={() => go(1)}
        >
          下一页
        </button>
      </footer>
    </section>
  )
}
