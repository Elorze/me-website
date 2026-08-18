import { HeroScene } from '@/components/hero/HeroScene'

type Props = {
  onOpenProjects?: () => void
  skipIntro?: boolean
}

/**
 * Homepage — immersive Guilin hero.
 */
export function HomePage({ onOpenProjects, skipIntro }: Props) {
  return <HeroScene onOpenProjects={onOpenProjects} skipIntro={skipIntro} />
}
