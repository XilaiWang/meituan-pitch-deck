// 明信片 — 路演 deck 截图采集
// 用全局 npx 缓存里的 playwright 驱动系统 chromium，串起 6 幕 demo + 父母端 + 双端回扣。
// 全程 viewMode='both'：对单个 .pf-phone 元素截图得到干净的设备图，双端回扣截 .pf-stage。
import { createRequire } from 'module'
const require = createRequire('/Users/xilaiwang/.npm/_npx/e41f203b7505f1fb/node_modules/')
const { chromium } = require('playwright')

const UI = 'http://localhost:5173'
const OUT = '/Users/xilaiwang/Desktop/meituan-pitch-deck/assets/shots'
const CHILD = '.pf-wrap:not(.pf-wrap--parent)'
const PARENT = '.pf-wrap--parent'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width: 1480, height: 1040 },
    deviceScaleFactor: 2,
  })
  page.on('console', m => { if (m.type() === 'error') console.log('  [page error]', m.text().slice(0, 120)) })

  const shots = []
  async function shot(name, selector) {
    try {
      const el = page.locator(selector).first()
      await el.waitFor({ state: 'visible', timeout: 8000 })
      await el.screenshot({ path: `${OUT}/${name}.png` })
      shots.push(name)
      console.log('  ✓', name)
    } catch (e) {
      console.log('  ✗', name, '—', String(e).split('\n')[0])
    }
  }
  // 在指定手机范围内按文本点按钮
  async function clickIn(scope, text, opts = {}) {
    const loc = page.locator(`${scope} button`, { hasText: text }).first()
    await loc.waitFor({ state: 'visible', timeout: 8000 })
    await loc.click(opts)
  }

  console.log('goto', UI)
  await page.goto(UI, { waitUntil: 'networkidle' })
  await page.waitForSelector('.xt-promo-card', { timeout: 12000 })
  await sleep(1000)

  // ── 父母端三连（开局，无关怀通知，干净）──
  await shot('20_parent_timeline', `${PARENT} .pf-phone`)

  try {
    await page.locator(`${PARENT} button[aria-label="谁能看到你的记录"]`).click()
    await page.waitForSelector(`${PARENT} .pp-person`, { timeout: 6000 })
    await sleep(500)
    await shot('21_parent_consent', `${PARENT} .pf-phone`)
    await page.locator(`${PARENT} .pp-sheet-close`).first().click()
    await sleep(400)
  } catch (e) { console.log('  ✗ parent consent flow', String(e).split('\n')[0]) }

  try {
    await page.locator(`${PARENT} .pp-ask-card`).click()
    await page.waitForSelector(`${PARENT} .pp-req-grid`, { timeout: 6000 })
    await sleep(500)
    await shot('22_parent_request', `${PARENT} .pf-phone`)
    await page.locator(`${PARENT} .pp-sheet-close`).first().click()
    await sleep(400)
  } catch (e) { console.log('  ✗ parent request flow', String(e).split('\n')[0]) }

  // ── 第 0 幕：小团首页入口 ──
  await shot('01_onboarding', `${CHILD} .pf-phone`)

  // ── 服务开通流程 4 步 ──
  await page.locator(`${CHILD} .xt-promo-card`).click()
  await page.waitForSelector(`${CHILD} .sf-hero-title`, { timeout: 8000 })
  await sleep(700)
  await shot('02_service_intro', `${CHILD} .pf-phone`)

  await clickIn(CHILD, '立即开通')
  await page.waitForSelector(`${CHILD} .sf-page-title`, { timeout: 8000 })
  try { await page.locator(`${CHILD} input[placeholder="例如：王秀英"]`).fill('王秀英') } catch {}
  await sleep(500)
  await shot('03_service_form', `${CHILD} .pf-phone`)

  await clickIn(CHILD, '下一步')
  await page.waitForSelector(`${CHILD} .sf-summary`, { timeout: 8000 })
  await sleep(500)
  await shot('04_service_confirm', `${CHILD} .pf-phone`)

  await clickIn(CHILD, '确认支付')
  await page.waitForSelector(`${CHILD} .sf-done-title`, { timeout: 8000 })
  await sleep(700)
  await shot('05_service_done', `${CHILD} .pf-phone`)

  await clickIn(CHILD, '查看建档后的效果')
  await page.waitForSelector(`${CHILD} .postcard-list`, { timeout: 10000 })
  await sleep(1600) // BlurText 标题落定
  await shot('06_feed', `${CHILD} .pf-phone`)

  // ── 评估师档案 ──
  try {
    await page.locator(`${CHILD} .feed-profile-card`).click()
    await page.waitForSelector(`${CHILD} .ps-title`, { timeout: 6000 })
    await sleep(700)
    await shot('07_profile_top', `${CHILD} .pf-phone`)
    await page.locator(`${CHILD} .ps-scroll`).evaluate(el => el.scrollTo({ top: 560, behavior: 'instant' }))
    await sleep(600)
    await shot('08_profile_meds', `${CHILD} .pf-phone`)
    await page.locator(`${CHILD} .ps-back`).click()
    await sleep(500)
  } catch (e) { console.log('  ✗ profile flow', String(e).split('\n')[0]) }

  // ── 第 2/3 幕：关怀 → 附近药店 ──
  await clickIn(CHILD, '帮她在药店补一份')
  await page.waitForSelector(`${CHILD} .nl-list`, { timeout: 8000 })
  await sleep(900)
  await shot('09_nearby', `${CHILD} .pf-phone`)

  // ── 第 4 幕：确认 → 模拟下单 ──
  await page.locator(`${CHILD} .nl-select-btn`).first().click()
  await page.waitForSelector(`${CHILD} .bm-title`, { timeout: 6000 })
  await sleep(600)
  await shot('10_booking_confirm', `${CHILD} .pf-phone`)

  await page.locator(`${CHILD} .bm-btn--confirm`).click()
  await page.waitForSelector(`${CHILD} .bm-success-title`, { timeout: 8000 })
  await sleep(1400) // GSAP 高潮落定
  await shot('11_booking_success', `${CHILD} .pf-phone`)

  await sleep(700)
  // GSAP autoAlpha 可能把 done 按钮留在 visibility:hidden 的判定上，用 dispatchEvent 直接触发 React onClick
  await page.locator(`${CHILD} .bm-btn--done`).dispatchEvent('click')
  await page.waitForSelector(`${CHILD} .postcard-list`, { timeout: 8000 })
  await sleep(2600) // 等父母端 2s 通知 + 卡片回写
  await shot('12_feed_booked', `${CHILD} .pf-phone`)

  // ── 记录 tab：关怀记录 + Agent 轨迹 ──
  try {
    await clickIn(CHILD, '记录')
    await page.waitForSelector(`${CHILD} .trace-pg`, { timeout: 6000 })
    await sleep(800)
    await shot('13_trace_care', `${CHILD} .pf-phone`)
    await clickIn(CHILD, 'Agent 轨迹')
    await page.waitForSelector(`${CHILD} .trace-pg-timeline`, { timeout: 6000 })
    await sleep(900)
    await shot('14_trace_agent', `${CHILD} .pf-phone`)
  } catch (e) { console.log('  ✗ trace flow', String(e).split('\n')[0]) }

  // ── 第 5 幕：双端回扣（回 feed，截整个 stage）──
  try {
    await clickIn(CHILD, '明信片')
    await page.waitForSelector(`${CHILD} .postcard-list`, { timeout: 6000 })
    await sleep(1400) // 等父母端「小明关心你」通知出现
    // 父母端滚到顶，露出绿色通知；子女端滚到顶，露出已回写的明信片卡
    await page.locator(`${PARENT} .pf-app-area`).evaluate(el => el.scrollTo({ top: 0, behavior: 'instant' })).catch(() => {})
    await page.locator(`${CHILD} .app-main`).evaluate(el => el.scrollTo({ top: 0, behavior: 'instant' })).catch(() => {})
    await sleep(500)
    await shot('23_parent_notif', `${PARENT} .pf-phone`)
    await shot('15_dual_callback', '.pf-stage')
  } catch (e) { console.log('  ✗ dual callback', String(e).split('\n')[0]) }

  await browser.close()
  console.log(`\nDONE — ${shots.length} shots:`, shots.join(', '))
}

run().catch(e => { console.error('FATAL', e); process.exit(1) })
