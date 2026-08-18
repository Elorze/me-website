import { site } from '@/content/site'

type Props = {
  visible: boolean
}

/**
 * Reference (AURUM layout):
 * - bottom-left brand: large display, warm gold (keep site gold)
 * - top-right entry: thin frame, egg-white / ivory with a hint of gold
 * Font feel: refined serif / 宋体 display (like AURUM), not brush script
 */
const displayFont =
  '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", "SimSun", serif'

const brandGold = 'rgba(255, 236, 200, 0.94)'
const ivory = 'rgba(252, 248, 240, 0.92)'
const ivoryBorder = 'rgba(245, 236, 220, 0.42)'

/**
 * After settle: 「云展」 bottom-left · 「项目经历」 top-right
 */
export function ProjectsEntry({ visible }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden={!visible}
    >
      {/* Top-right — like「探索 · 山脉」: thin ivory frame */}
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
          className="projects-entry px-5 py-2.5 leading-none transition-opacity duration-300 hover:opacity-80 sm:px-6 sm:py-3"
          style={{
            fontFamily: displayFont,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
            fontWeight: 400,
            color: ivory,
            letterSpacing: '0.28em',
            paddingRight: 'calc(1.5rem + 0.28em)',
            background: 'rgba(255, 252, 245, 0.04)',
            border: `1px solid ${ivoryBorder}`,
            borderRadius: 2,
          }}
          aria-label={site.projectsLabel}
        >
          {site.projectsLabel}
        </button>
      </div>

      {/* Bottom-left — like「AURUM」: large warm-gold brand */}
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
            color: brandGold,
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
