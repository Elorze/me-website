import logo from '@/assets/images/metaloft/image2.jpeg'
import monumentA from '@/assets/images/metaloft/image3.png'
import monumentB from '@/assets/images/metaloft/image5.png'
import demoStill from '@/assets/images/metaloft/image6.png'
import albumSpace from '@/assets/images/metaloft/image7.png'
import creatorSpace from '@/assets/images/metaloft/image8.png'
import patina0 from '@/assets/images/metaloft/image12.png'
import patina1 from '@/assets/images/metaloft/image13.png'
import patina2 from '@/assets/images/metaloft/image14.png'
import patina3 from '@/assets/images/metaloft/image15.png'

export type DeckSlide = {
  kicker: string
  title: string
  lead?: string
  body?: string[]
  columns?: { heading: string; items: string[] }[]
  bullets?: string[]
  note?: string
  images?: { src: string; caption?: string }[]
  closing?: boolean
}

export const metaloftDeck = {
  brand: 'METALOFT',
  brandZh: '梅塔洛芙特',
  logo,
  slides: [
    {
      kicker: 'MEMORY / ART / ONCHAIN',
      title: '让记忆被重新建造',
      body: [
        '让生活碎片拥有价值。',
        'METALOFT 将照片、语音与日常瞬间转化为可展示、可收藏、可进化、可打印的数字纪念碑。让记忆也拥有价值，让创作更加便捷，让链上更加有趣。',
      ],
      note: 'Brand deck / v3',
    },
    {
      kicker: '01 / The category',
      title: '不是普通的 3D 生成工具',
      lead: 'METALOFT 是一套把记忆变成数字作品与长期资产的系统。它连接四个层次的价值：情感表达、空间展示、收藏沉淀与持续进化。',
      columns: [
        {
          heading: '记忆输入',
          items: ['照片', '语音', '视频与文案'],
        },
        {
          heading: 'AI 重建',
          items: ['3D 模型', '空间编排', '艺术化包浆'],
        },
        {
          heading: '价值输出',
          items: ['纪念碑', '数字相册', 'DNFT 与打印'],
        },
      ],
      note: '做的核心不是“做模型”，而是把个人记忆重建成可被进入、被摆放、被保存、被流转的数字形态。',
    },
    {
      kicker: '02 / Three user paths',
      title: '三类核心用户，同一套引擎',
      lead: '共用同一套引擎，但获得完全不同的记忆结果。文旅强调纪念品升级，家庭与朋友强调生活记录，创作者强调空间表达与作品展示。',
      columns: [
        {
          heading: '文旅用户',
          items: [
            '把旅行记忆做成数字纪念碑',
            '通过轻量堆叠玩法完成独一无二的 monument',
            '延伸到 3D 打印与寄送，形成高情绪价值付费点',
          ],
        },
        {
          heading: '家庭 / 朋友 / Z 世代',
          items: [
            '把日常照片、视频、文案重组为数字相册空间',
            '相册从平面记录升级为可进入的生活场景',
            'Credits 和空间订阅构成长期复购',
          ],
        },
        {
          heading: '创作者 / 艺术家',
          items: [
            '把作品与个性空间沉淀为长期展示场',
            '以 UGC 方式布置数字小屋，而不是套用固定模板',
            '支持未来策展、限时 drop 与核心粉丝进入',
          ],
        },
      ],
    },
    {
      kicker: '03 / Digital memory monument',
      title: '数字记忆纪念碑',
      lead: '这是 METALOFT 最独特的产品形态。它不是普通摆件，而是把一段经历、一组碎片、一个地点，堆叠成可被记住的空间雕塑。',
      bullets: [
        '照片与语音被转化为可堆叠的记忆模块',
        '用户通过 WASD 控制轻量玩法完成自己的 monument',
        '每一层都可以对应一段时间、一处地理位置或一段关系',
      ],
      note: '付费逻辑：纪念碑生成 + 3D 打印寄送',
      images: [
        { src: monumentA, caption: '纪念碑空间' },
        { src: monumentB, caption: '记忆堆叠' },
      ],
    },
    {
      kicker: '产品演示',
      title: '纪念碑如何被建造',
      images: [{ src: demoStill, caption: '从碎片到可进入的纪念碑' }],
    },
    {
      kicker: '04 / Album space',
      title: '相册空间',
      lead: '让“记录生活”从文件管理，变成空间化表达。更适合亲子、朋友关系与年轻用户的日常分享——内容不只是被存档，而是被重新组织。',
      columns: [
        {
          heading: '内容输入',
          items: [
            '上传日常照片、视频和文案',
            '生成可浏览、可扩展、可沉淀的个人空间',
          ],
        },
        {
          heading: '付费逻辑',
          items: ['购买 credits 生成记忆模型', '订阅自己的独特空间'],
        },
      ],
      images: [{ src: albumSpace, caption: '数字相册空间' }],
    },
    {
      kicker: '05 / Creator mode',
      title: '创作者模式',
      lead: '对创作者而言，METALOFT 是作品画廊，也是可持续演化的个人空间。空间本身就是表达的一部分。',
      bullets: [
        '把作品从单张图像升级为可被漫游的展示空间',
        '支持以 UGC 方式布置数字小屋，而不是依赖预设模板',
        '未来可扩展到协作策展、主题房间和粉丝进入机制',
      ],
      note: '从“展示作品”升级为“经营自己的数字空间”',
      images: [{ src: creatorSpace, caption: '创作者空间' }],
    },
    {
      kicker: '06 / Main domain',
      title: '主域空间',
      lead: '主域是 METALOFT 的内容广场，也是核心用户层真正发生的地方。免费标签化模型吸引用户进入，再逐步引导到更深的收藏、展示与互动。',
      bullets: [
        '先投放大量免费标签模型，例如 MBTI 等',
        '每位新用户拥有 3 次免费机会，先完成第一次生成',
        '核心用户可携带 3 个最特殊的记忆模型进入主域',
        '第三人称移动、探索和放置，构成强参与感和空间认同',
        '联名艺术家共同打造主域 lab，持续扩展主域体验',
      ],
      note: '付费口令成为核心用户。',
    },
    {
      kicker: '07 / Growth loop',
      title: '从免费体验到链上资产',
      columns: [
        { heading: '01 免费吸引', items: ['标签化免费模型', '3 次免费机会'] },
        { heading: '02 首次生成', items: ['产出第一个记忆模型', '开始搭建个人空间'] },
        { heading: '03 持续活跃', items: ['登录、分享、生成、进入主域', '都能获得积分'] },
        { heading: '04 核心用户', items: ['进入主域', '放置 3 个最特别的模型'] },
        { heading: '05 资产进化', items: ['一键上链 / Mint', 'DNFT 持续变化'] },
      ],
      note: '目前线下测试种子用户突破 200+。积分后续可承接社群合作、物品兑换和主域权益。',
    },
    {
      kicker: '08 / Onchain and DNFT',
      title: '上链与 DNFT',
      lead: '上链不是附加功能，而是让记忆作品拥有长期流动性与演化能力。METALOFT 与 Injective 生态协作，支持低门槛上链，并把 NFT 做成可变化的 DNFT。',
      bullets: [
        '与 INJPASS 协作，支持 0 gas 一键上链或一键 Mint',
        '主域分为 7 个层级，越往下包浆越明显，形成“电子包浆”NFT',
        'NFT 会在时间推进与交易过程中经历 AI 自然变化，并映射回主域',
        '用户可以选择改变或保持原样',
      ],
    },
    {
      kicker: '09 / AI patina',
      title: 'AI 包浆',
      lead: '把静态图像和静态模型，变成随着时间、层级和流转不断偏移的作品。这是“持续变化”最容易被感知的证据。',
      images: [
        { src: patina0, caption: '原始结构开始被轻微偏移' },
        { src: patina1, caption: '颜色和边缘开始发光与漂移' },
        { src: patina2, caption: '形体被进一步拉开并抽象化' },
        { src: patina3, caption: '进入强风格化的艺术状态' },
      ],
    },
    {
      kicker: '10 / Business model',
      title: '商业模式',
      lead: '短期先跑通内容与空间付费，中期建立核心用户层，长期承接链上流转和社区合作。',
      columns: [
        {
          heading: '短期现金流',
          items: ['数字记忆纪念碑生成', '3D 打印与寄送', '模型 Credits 与高级功能'],
        },
        {
          heading: '中期复购',
          items: ['个人空间订阅', '主题模板与创作者展示位', '主域准入与身份成长'],
        },
        {
          heading: '长期网络价值',
          items: ['NFT / DNFT 铸造与流转', '积分对接社区交换', '主域权益与链上合作'],
        },
      ],
      note: '先从真实内容消费跑出闭环，再让链上层去放大价值。',
    },
    {
      kicker: 'METALOFT',
      title: '让记忆不止被保存，而是被重新建造。',
      lead: 'REBUILD MEMORY AS LIVING DIGITAL ART',
      body: [
        '一个月内上线内测版本，先跑通纪念碑空间、数字相册空间、主域体验与基础链上闭环。',
      ],
      closing: true,
    },
  ] satisfies DeckSlide[],
}
