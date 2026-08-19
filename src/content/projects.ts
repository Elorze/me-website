import { images } from './assets'

export type ProjectAction =
  | { type: 'link'; label: string; href: string }
  | { type: 'intro'; label?: string }
  | { type: 'video'; label: string; src: string }

export type Project = {
  id: string
  year: string
  place: string
  title: string
  summary: string
  cover: string
  intro?: 'metaloft' | 'zhongzhong'
  actions?: ProjectAction[]
}

/**
 * Project archive copy — edit here first when changing content.
 */
export const projects: Project[] = [
  {
    id: 'metaloft',
    year: '[with Ding] 文旅，数字相册空间，创作者',
    place: '',
    title: 'METALOFT',
    summary:
      '将照片、语音与日常瞬间转化为可展示、可收藏、可进化、可打印的数字纪念碑。让记忆也拥有价值，让创作更加便捷，让链上更加有趣。',
    cover: images.metaloftCover,
    intro: 'metaloft',
    actions: [
      { type: 'link', label: '网页', href: 'https://www.metaloftlab.com/' },
      { type: 'intro' },
      { type: 'video', label: '视觉视频', src: '/videos/metaloft-visual.mp4' },
    ],
  },
  {
    id: 'zhongzhong',
    year: '[with 万文熙] 本土植物，视觉，ip',
    place: '',
    title: '种种大世界',
    summary:
      '一个以本土植物为元素的视觉世界，探索植物的多样性和生命力。',
    cover: images.zhongzhongCover,
    intro: 'zhongzhong',
    actions: [
      { type: 'link', label: '官网', href: 'https://www.zhongzhongworld.net/' },
      { type: 'intro' },
      {
        type: 'link',
        label: '种种酒馆（时间管理番茄钟）',
        href: 'https://lifekitchen.zhongzhongworld.net',
      },
    ],
  },
  {
    id: 'nantang-bai',
    year: '[with 蓝莓，cc] 乡村自组织，web3，梦开始的地方',
    place: '',
    title: '南塘 · BAI 社区任务系统',
    summary:
      '去中心化自组织治理，web3数字身份，让每一份社区贡献记录在区块链上',
    cover: images.guilinWide,
    actions: [
      {
        type: 'video',
        label: 'semi数字身份和bai平台介绍视频',
        src: '/videos/nantang-semi-bai.mp4',
      },
      {
        type: 'link',
        label: 'semi数字身份github介绍',
        href: 'https://github.com/nantang-dao',
      },
      { type: 'link', label: 'semi', href: 'https://semi.ntdao.xyz' },
    ],
  },
] satisfies Project[]

export const archiveMeta = {
  titleZh: '项目经历',
  titleEn: 'PROJECT ARCHIVE',
  cta: '网页',
  introCta: '项目介绍',
} as const
