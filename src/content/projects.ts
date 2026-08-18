import { images } from './assets'

export type Project = {
  id: string
  year: string
  place: string
  title: string
  summary: string
  cover: string
  website?: string
  websiteLabel?: string
  intro?: 'metaloft'
}

/**
 * Project archive copy — edit here first when changing content.
 */
export const projects: Project[] = [
  {
    id: 'lijiang-light',
    year: '文旅，数字相册空间，创作者',
    place: '',
    title: 'METALOFT',
    summary:
      '将照片、语音与日常瞬间转化为可展示、可收藏、可进化、可打印的数字纪念碑。让记忆也拥有价值，让创作更加便捷，让链上更加有趣。',
    cover: images.metaloftCover,
    website: 'https://www.metaloftlab.com/',
    websiteLabel: '网页',
    intro: 'metaloft',
  },
  {
    id: 'dawn-gate',
    year: '2024',
    place: '桂林',
    title: '晨门 · 光影序章',
    summary:
      '以门洞与光环作为叙事入口，将山水摄影转译为可漫游的沉浸式空间体验。',
    cover: images.guilinTall,
  },
  {
    id: 'mist-scroll',
    year: '2024',
    place: '阳朔',
    title: '云岚卷 · 交互长卷',
    summary:
      '用流动的雾气作为章节过渡，让浏览节奏贴近山水画中的留白与呼吸。',
    cover: images.guilinWide,
  },
  {
    id: 'stone-echo',
    year: '2025',
    place: '漓江',
    title: '石韵 · 声景共鸣',
    summary:
      '结合空间音景与深度视差，让峰林轮廓在光色变化中产生可感知的回响。',
    cover: images.guilinTall,
  },
  {
    id: 'archive-nest',
    year: '2025',
    place: '云展',
    title: '展巢 · 作品归档',
    summary:
      '为后续作品预留的归档位，延续同一套光色与字体语言，保持观展连贯性。',
    cover: images.guilinWide,
  },
] satisfies Project[]

export const archiveMeta = {
  titleZh: '项目经历',
  titleEn: 'PROJECT ARCHIVE',
  cta: '网页',
  introCta: '项目介绍',
} as const
