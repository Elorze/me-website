import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
} from 'react'
import { metaloftDeck } from '@/content/metaloftDeck'
import { archiveMeta, projects, type ProjectAction } from '@/content/projects'
import { displayFont, ui } from '@/content/theme'
import { zhongzhongDeck } from '@/content/zhongzhongDeck'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { ProjectIntro } from './ProjectIntro'
import { VideoPlayer } from './VideoPlayer'

type Props = {
  visible: boolean
  onHome?: () => void
}

const ghostBtn: CSSProperties = {
  fontFamily: displayFont,
  fontSize: 'clamp(0.76rem, 2.8vw, 0.9rem)',
  color: ui.goldSoft,
  letterSpacing: '0.1em',
  padding: '0.65rem 1rem',
  background: 'transparent',
  border: `1px solid ${ui.ivoryBorder}`,
  borderRadius: 1,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  lineHeight: 1.45,
  width: '100%',
  boxSizing: 'border-box',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  cursor: 'pointer',
}

/**
 * Project archive — dark ink stage, Songti + warm gold.
 * Wheel / swipe / keys cycle projects (no mist between items).
 */
export function ProjectArchive({ visible, onHome }: Props) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [introOpen, setIntroOpen] = useState(false)
  const [video, setVideo] = useState<{ src: string; title: string } | null>(null)
  const lockRef = useRef(false)
  const unlockTimer = useRef<number | undefined>(undefined)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const project = projects[index] ?? projects[0]
  const introDeck =
    project.intro === 'metaloft'
      ? metaloftDeck
      : project.intro === 'zhongzhong'
        ? zhongzhongDeck
        : null
  const nodeTop = `${10 + (index / Math.max(projects.length - 1, 1)) * 72}%`
  const overlayOpen = introOpen || Boolean(video)
  const actions = (project.actions ?? []).filter(
    (action) => action.type !== 'intro' || Boolean(introDeck),
  )

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
    if (!visible || overlayOpen) return

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 18) return
      const target = e.target as HTMLElement | null
      const scroller = target?.closest?.('.deck-scroll') as HTMLElement | null
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
        const atTop = scroller.scrollTop <= 0
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
        if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return
      }
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
  }, [visible, overlayOpen, index, goTo, onHome])

  const onTouchStart = (e: TouchEvent) => {
    if (overlayOpen) return
    const t = e.changedTouches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (overlayOpen || !touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    // Horizontal swipe only — vertical is reserved for scrolling copy/cover.
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.15) return
    goTo(index + (dx < 0 ? 1 : -1))
  }

  const renderAction = (action: ProjectAction, i: number) => {
    if (action.type === 'link') {
      return (
        <a
          key={`action-${i}-${action.label}`}
          data-testid="project-action"
          data-action-type="link"
          className="ui-interactive transition-opacity hover:opacity-80"
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          style={ghostBtn}
        >
          {action.label}
        </a>
      )
    }
    if (action.type === 'intro') {
      const label = action.label ?? archiveMeta.introCta
      return (
        <button
          key={`action-${i}-${label}`}
          type="button"
          data-testid="project-action"
          data-action-type="intro"
          className="ui-interactive transition-opacity hover:opacity-80"
          style={ghostBtn}
          onClick={() => setIntroOpen(true)}
        >
          {label}
        </button>
      )
    }
    return (
      <button
        key={`action-${i}-${action.label}`}
        type="button"
        data-testid="project-action"
        data-action-type="video"
        className="ui-interactive transition-opacity hover:opacity-80"
        style={ghostBtn}
        onClick={() => setVideo({ src: action.src, title: action.label })}
      >
        {action.label}
      </button>
    )
  }

  return (
    <section
      className="relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden"
      style={{
        background: ui.ink,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
      aria-hidden={!visible}
      data-testid="project-archive"
      data-project-id={project.id}
      data-project-index={index}
      data-action-count={actions.length}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
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

      <header className="relative z-10 flex shrink-0 items-start justify-between gap-4 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:items-center sm:px-10 sm:pt-10 lg:px-14">
        <h1
          className="m-0 min-w-0 leading-snug sm:leading-none"
          style={{
            fontFamily: displayFont,
            fontSize: 'clamp(0.92rem, 3.4vw, 1.28rem)',
            fontWeight: 400,
            color: ui.goldSoft,
            letterSpacing: '0.12em',
          }}
        >
          {archiveMeta.titleZh}
          <span className="hidden sm:inline" style={{ margin: '0 0.5em', opacity: 0.5 }}>
            /
          </span>
          <span
            className="mt-1 block sm:mt-0 sm:inline"
            style={{
              fontSize: '0.78em',
              letterSpacing: '0.2em',
              opacity: 0.82,
            }}
          >
            {archiveMeta.titleEn}
          </span>
        </h1>

        <button
          type="button"
          className="ui-interactive grid shrink-0 grid-cols-3 gap-[5px] p-2 transition-opacity hover:opacity-70"
          aria-label="返回首页"
          data-testid="archive-home"
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
        className="relative mx-4 mt-4 h-px shrink-0 sm:mx-10 sm:mt-5 lg:mx-14"
        style={{
          background: `linear-gradient(90deg, ${ui.goldLine}, rgba(197,147,69,0.12) 55%, transparent)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="deck-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-20 pt-4 sm:px-10 sm:pb-10 lg:px-14 lg:pb-10">
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.95fr)] lg:items-center lg:gap-12 xl:gap-16">
            <div className="relative flex items-stretch gap-4 sm:min-h-[32vh] sm:gap-6 lg:min-h-[58vh]">
              <div className="relative hidden w-px shrink-0 self-stretch sm:block" aria-hidden>
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
                className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-auto sm:min-h-[30vh] sm:flex-1 lg:min-h-0"
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
              className="flex min-h-0 flex-col justify-center py-1 lg:pl-2"
              style={{
                animation: reduced
                  ? undefined
                  : 'archive-copy-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              <p
                className="m-0 mb-2 sm:mb-3"
                data-testid="project-year"
                style={{
                  fontFamily: displayFont,
                  fontSize: '0.78rem',
                  color: ui.goldSoft,
                  letterSpacing: '0.1em',
                  lineHeight: 1.7,
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
                className="m-0 mb-3 sm:mb-4"
                data-testid="project-title"
                style={{
                  fontFamily: displayFont,
                  fontSize: 'clamp(1.28rem, 5.2vw, 2.2rem)',
                  fontWeight: 400,
                  color: ui.ivory,
                  letterSpacing: '0.04em',
                  lineHeight: 1.35,
                }}
              >
                {project.title}
              </h2>

              <p
                className="m-0 mb-5 max-w-[26rem] sm:mb-6"
                data-testid="project-summary"
                style={{
                  fontFamily: displayFont,
                  fontSize: 'clamp(0.84rem, 3.2vw, 0.96rem)',
                  color: ui.ivoryMuted,
                  letterSpacing: '0.03em',
                  lineHeight: 1.75,
                }}
              >
                {project.summary}
              </p>

              <div
                className="flex w-full max-w-[26rem] flex-col gap-2.5"
                data-testid="project-actions"
              >
                {actions.map((action, i) => renderAction(action, i))}
              </div>
            </div>
          </div>
        </div>

        <nav
          className="absolute inset-x-0 bottom-[max(0.85rem,env(safe-area-inset-bottom))] z-20 flex justify-center gap-3 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:items-center sm:gap-3.5 lg:right-9"
          aria-label="项目列表"
          data-testid="project-dots"
        >
          {projects.map((item, i) => {
            const active = i === index
            return (
              <button
                key={item.id}
                type="button"
                className={`ui-interactive rounded-full border-0 p-0 transition-all duration-500 ${
                  active
                    ? 'h-1.5 w-[22px] sm:h-[26px] sm:w-[3px]'
                    : 'h-1.5 w-1.5 sm:h-[5px] sm:w-[5px]'
                }`}
                aria-label={item.title}
                aria-current={active ? 'true' : undefined}
                data-testid={`project-dot-${i}`}
                onClick={() => goTo(i)}
                style={{
                  background: active ? ui.goldSoft : 'rgba(197, 147, 69, 0.4)',
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

      <VideoPlayer
        open={Boolean(video)}
        src={video?.src ?? null}
        title={video?.title}
        onClose={() => setVideo(null)}
      />
    </section>
  )
}
