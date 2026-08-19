/**
 * Smoke E2E: desktop + mobile archive action buttons stay reachable.
 * Run: node scripts/e2e-projects.mjs
 */
import { chromium, devices } from 'playwright'

const BASE = process.env.E2E_BASE || 'http://localhost:311'

const expected = [
  {
    id: 'metaloft',
    title: 'METALOFT',
    labels: ['网页', '项目介绍', '视觉视频'],
  },
  {
    id: 'zhongzhong',
    title: '种种大世界',
    labels: ['官网', '项目介绍', '种种酒馆（时间管理番茄钟）'],
  },
  {
    id: 'nantang-bai',
    title: '南塘 · BAI 社区任务系统',
    labels: ['semi数字身份和bai平台介绍视频', 'semi数字身份github介绍', 'semi'],
  },
]

const profiles = [
  {
    name: 'desktop',
    device: devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'mobile',
    device: devices['iPhone 12'],
    viewport: null,
  },
]

async function assertArchive(page, viewportHeight, failures, profileName) {
  const entry = page.getByTestId('projects-entry')
  await entry.waitFor({ state: 'visible', timeout: 20000 })
  await page.waitForTimeout(400)
  await entry.click({ force: true })

  const archive = page.getByTestId('project-archive')
  await archive.waitFor({ state: 'visible' })
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="project-archive"]')
    return el && Number(el.getAttribute('data-action-count') || 0) > 0
  })

  for (let i = 0; i < expected.length; i++) {
    const want = expected[i]
    if (i > 0) {
      await page.getByTestId(`project-dot-${i}`).click()
    }
    await page.waitForFunction(
      (id) =>
        document
          .querySelector('[data-testid="project-archive"]')
          ?.getAttribute('data-project-id') === id,
      want.id,
    )

    const title = (await page.getByTestId('project-title').innerText()).trim()
    if (title !== want.title) {
      failures.push(`[${profileName}/${want.id}] title="${title}" expected="${want.title}"`)
    }

    const countAttr = await archive.getAttribute('data-action-count')
    if (Number(countAttr) !== want.labels.length) {
      failures.push(
        `[${profileName}/${want.id}] data-action-count=${countAttr} expected=${want.labels.length}`,
      )
    }

    const buttons = page.getByTestId('project-action')
    await buttons.first().waitFor({ state: 'attached' })
    const n = await buttons.count()
    if (n !== want.labels.length) {
      failures.push(
        `[${profileName}/${want.id}] visible actions=${n} expected=${want.labels.length}`,
      )
    }

    const texts = []
    for (let b = 0; b < n; b++) {
      const btn = buttons.nth(b)
      await btn.scrollIntoViewIfNeeded()
      texts.push((await btn.innerText()).trim().replace(/\s+/g, ''))
      const box = await btn.boundingBox()
      if (!box || box.height < 8 || box.width < 8) {
        failures.push(`[${profileName}/${want.id}] action #${b} not visible/clipped`)
        continue
      }
      // After scrollIntoView, button should intersect the viewport.
      if (box.y + box.height < 0 || box.y > viewportHeight) {
        failures.push(
          `[${profileName}/${want.id}] action #${b} outside viewport y=${box.y} h=${viewportHeight}`,
        )
      }
    }

    for (const label of want.labels) {
      const normalized = label.replace(/\s+/g, '')
      if (!texts.includes(normalized)) {
        failures.push(
          `[${profileName}/${want.id}] missing button "${label}" (got: ${texts.join(' | ')})`,
        )
      }
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const failures = []

  try {
    for (const profile of profiles) {
      const context = await browser.newContext({
        ...profile.device,
        ...(profile.viewport ? { viewport: profile.viewport } : {}),
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()
      page.setDefaultTimeout(60000)

      try {
        await page.goto(BASE, { waitUntil: 'domcontentloaded' })
        const vp = page.viewportSize() || { width: 390, height: 844 }
        await assertArchive(page, vp.height, failures, profile.name)
      } catch (err) {
        failures.push(`[${profile.name}] ${String(err)}`)
        try {
          await page.screenshot({
            path: `scripts/e2e-fail-${profile.name}.png`,
            fullPage: true,
          })
          console.error(`Saved scripts/e2e-fail-${profile.name}.png`)
        } catch {
          /* ignore */
        }
      } finally {
        await context.close()
      }
    }
  } finally {
    await browser.close()
  }

  if (failures.length) {
    console.error('E2E FAILED')
    for (const f of failures) console.error(' -', f)
    process.exit(1)
  }

  console.log('E2E PASSED: desktop + mobile expose expected action buttons')
}

main()
