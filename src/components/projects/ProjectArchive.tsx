import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { metaloftDeck } from '@/content/metaloftDeck'
import { archiveMeta, projects } from '@/content/projects'
import { displayFont, ui } from '@/content/theme'
import { zhongzhongDeck } from '@/content/zhongzhongDeck'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { ProjectIntro } from './ProjectIntro'

type Props = {
  visible: boolean
  onHome?: () => void
}

const ghostBtn: CSSProperties = {
  fontFamily: displayFont,
  fontSize: '0.92rem',
  color: ui.goldSoft,
  letterSpacing: '0.22em',
  padding: '0.62rem 1.5rem',
  paddingRight: 'calc(1.5rem + 0.22em)',
  background: 'transparent',
  border: `1px solid ${ui.ivoryBorder}`,
  borderRadius: 1,
  textDecoration: 'none',
  display: 'inline-block',
}

/**
 * Project archive — dark ink stage, Songti + warm gold.
 * Wheel / arrow keys cycle projects (no mist between items).
 */
export function ProjectArchive({ visible, onHome }: Props) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [introOpen, setIntroOpen] = useState(false)
  const lockRef = useRef(false)
  const unlockTimer = useRef<number | undefined>(undefined)
  const project = projects[index] ?? projects[0]
  const introDeck =
    project.intro === 'metaloft'
      ? metaloftDeck
      : project.intro === 'zhongzhong'
        ? zhongzhongDeck
        : null
  const nodeTop = `${10 + (index / Math.max(projects.length - 1, 1)) * 72}%`

  const goTo = useCallback(
    (next: number) => {
      const clamped = ((next % projects.length) + projects.length) % projects.length
      if (clamped === index || lockRef.current) return

      setIndex(clamped)
      lockRef.current = true
      if (unlockTimer.current !== undefined) window.clearTimeout(unlockTimer.current)
      unlockTimer.current = window.setTimeout(() => {
        lockRef.current = false
      }, reduced ? 120 : 420)
    },
    [index, reduced],
  )

  useEffect(() => {
    return () => {
      if (unlockTimer.current !== undefined) window.clearTimeout(unlockTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!visible || introOpen) return

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 18) return
      e.preventDefault()
      goTo(index + (e.deltaY > 0 ? 1 : -1))
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault()
        goTo(index + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault()
        goTo(index - 1)
      } else if (e.key === 'Escape') {
        onHome?.()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [visible, introOpen, index, goTo, onHome])

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: ui.ink,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
      aria-hidden={!visible}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(180deg, rgba(90, 55, 18, 0.28) 0%, transparent 100%)',
        }}
        aria-hidden
      />
      <div className="grain absolute inset-0 opacity-[0.045]" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14">
        <h1
          className="m-0 leading-none"
          style={{
            fontFamily: displayFont,
            fontSize: 'clamp(1rem, 1.8vw, 1.28rem)',
            fontWeight: 400,
            color: ui.goldSoft,
            letterSpacing: '0.16em',
          }}
        >
          {archiveMeta.titleZh}
          <span style={{ margin: '0 0.5em', opacity: 0.5 }}>/</span>
          <span
            style={{
              fontSize: '0.78em',
              letterSpacing: '0.26em',
              opacity: 0.82,
            }}
          >
            {archiveMeta.titleEn}
          </span>
        </h1>

        <button
          type="button"
          className="ui-interactive grid grid-cols-3 gap-[5px] p-2 transition-opacity hover:opacity-70"
          aria-label="返回首页"
          onClick={onHome}
          style={{ color: ui.goldSoft }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="block h-[3px] w-[3px] rounded-full"
              style={{ background: 'currentColor' }}
            />
          ))}
        </button>
      </header>

      <div
        className="relative mx-6 mt-5 h-px sm:mx-10 lg:mx-14"
        style={{
          background: `linear-gradient(90deg, ${ui.goldLine}, rgba(197,147,69,0.12) 55%, transparent)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex h-[calc(100%-6.25rem)] items-center px-6 pb-8 sm:px-10 lg:px-14 lg:pb-12">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.85fr)] lg:gap-14 xl:gap-16">
          <div className="relative flex min-h-[40vh] items-stretch gap-5 sm:gap-6 lg:min-h-[62vh]">
            <div className="relative w-px shrink-0 self-stretch" aria-hidden>
              <div
                className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                style={{ background: ui.goldLine }}
              />
              <span
                className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-[top] duration-700 ease-out"
                style={{
                  top: nodeTop,
                  background: ui.ember,
                  boxShadow:
                    '0 0 8px rgba(232, 93, 4, 0.95), 0 0 26px rgba(255, 150, 50, 0.55)',
                }}
              />
            </div>

            <div
              className="relative min-h-[36vh] flex-1 overflow-hidden lg:min-h-0"
              style={{
                background: ui.inkRaised,
                boxShadow: 'inset 0 0 0 1px rgba(245, 236, 220, 0.07)',
              }}
            >
              <img
                key={project.id}
                src={project.cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: 0.9,
                  filter: 'saturate(0.9) contrast(1.05) brightness(0.92)',
                  animation: reduced
                    ? undefined
                    : 'archive-media-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(115deg, rgba(10,6,4,0.2) 0%, transparent 42%, rgba(10,6,4,0.4) 100%)',
                }}
              />
            </div>
          </div>

          <div
            key={`copy-${project.id}`}
            className="max-w-md lg:pl-2"
            style={{
              animation: reduced
                ? undefined
                : 'archive-copy-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            <p
              className="m-0 mb-4"
              style={{
                fontFamily: displayFont,
                fontSize: '0.82rem',
                color: ui.goldSoft,
                letterSpacing: '0.22em',
              }}
            >
              {project.year}
              {project.place ? (
                <>
                  <span style={{ margin: '0 0.45em', opacity: 0.65 }}>·</span>
                  {project.place}
                </>
              ) : null}
            </p>

            <h2
              className="m-0 mb-5"
              style={{
                fontFamily: displayFont,
                fontSize: 'clamp(1.65rem, 3.2vw, 2.45rem)',
                fontWeight: 400,
                color: ui.ivory,
                letterSpacing: '0.06em',
                lineHeight: 1.38,
              }}
            >
              {project.title}
            </h2>

            <p
              className="m-0 mb-9 max-w-[22rem]"
              style={{
                fontFamily: displayFont,
                fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)',
                color: ui.ivoryMuted,
                letterSpacing: '0.045em',
                lineHeight: 1.9,
              }}
            >
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-3">
              {project.website && (
                <a
                  className="ui-interactive transition-opacity hover:opacity-80"
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={ghostBtn}
                >
                  {project.websiteLabel ?? archiveMeta.cta}
                </a>
              )}
              {introDeck && (
                <button
                  type="button"
                  className="ui-interactive transition-opacity hover:opacity-80"
                  style={ghostBtn}
                  onClick={() => setIntroOpen(true)}
                >
                  {archiveMeta.introCta}
                </button>
              )}
            </div>
          </div>
        </div>

        <nav
          className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3.5 sm:right-6 lg:right-9"
          aria-label="项目列表"
        >
          {projects.map((item, i) => {
            const active = i === index
            return (
              <button
                key={item.id}
                type="button"
                className="ui-interactive transition-all duration-500"
                aria-label={item.title}
                aria-current={active ? 'true' : undefined}
                onClick={() => goTo(i)}
                style={{
                  width: active ? 3 : 5,
                  height: active ? 26 : 5,
                  borderRadius: 999,
                  background: active ? ui.goldSoft : 'rgba(197, 147, 69, 0.4)',
                  border: 'none',
                  padding: 0,
                }}
              />
            )
          })}
        </nav>
      </div>

      {introDeck && (
        <ProjectIntro
          open={introOpen}
          onClose={() => setIntroOpen(false)}
          deck={introDeck}
        />
      )}
    </section>
  )
}
