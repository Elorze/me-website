import { site } from '@/content/site'
import { displayFont, ui } from '@/content/theme'

type Props = {
  visible: boolean
  onOpenProjects?: () => void
}

/**
 * After settle: 「云展」 bottom-left · 「项目经历」 top-right
 */
export function ProjectsEntry({ visible, onOpenProjects }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden={!visible}
    >
      <div
        className="absolute right-0 top-0 p-5 sm:p-8 lg:p-10"
        style={{
          transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -8px, 0)',
          transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <button
          type="button"
          className="projects-entry ui-interactive px-5 py-2.5 leading-none transition-opacity duration-300 hover:opacity-80 sm:px-6 sm:py-3"
          style={{
            fontFamily: displayFont,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
            fontWeight: 400,
            color: ui.ivory,
            letterSpacing: '0.28em',
            paddingRight: 'calc(1.5rem + 0.28em)',
            background: 'rgba(255, 252, 245, 0.04)',
            border: `1px solid ${ui.ivoryBorder}`,
            borderRadius: 2,
          }}
          aria-label={site.projectsLabel}
          onClick={onOpenProjects}
        >
          {site.projectsLabel}
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 p-5 sm:p-8 lg:p-10"
        style={{
          transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 10px, 0)',
          transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p
          className="m-0 select-none leading-none"
          style={{
            fontFamily: displayFont,
            fontSize: 'clamp(2.6rem, 6.5vw, 4.5rem)',
            fontWeight: 400,
            color: ui.brandGold,
            letterSpacing: '0.22em',
            marginRight: '-0.22em',
            textShadow: '0 2px 28px rgba(20, 8, 0, 0.35)',
          }}
          aria-label={site.name}
        >
          {site.name}
        </p>
      </div>
    </div>
  )
}
