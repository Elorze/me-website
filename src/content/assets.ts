/**
 * Central asset registry — import images once, reuse everywhere.
 */
import guilinWide from '@/assets/images/guilin-wide.jpg'
import guilinTall from '@/assets/images/guilin-tall.jpg'
import guilinWideDepth from '@/assets/images/guilin-wide-depth.png'
import guilinTallDepth from '@/assets/images/guilin-tall-depth.png'
import smokeAlpha from '@/assets/images/smoke-alpha.png'
import sunGlow from '@/assets/images/sun-glow.png'
import metaloftCover from '@/assets/images/metaloft-cover.png'
import zhongzhongCover from '@/assets/images/zhongzhong/cover.png'

export const images = {
  guilinWide,
  guilinTall,
  guilinWideDepth,
  guilinTallDepth,
  smokeAlpha,
  sunGlow,
  metaloftCover,
  zhongzhongCover,
} as const
