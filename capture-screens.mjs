// 截「纯屏幕」.pf-screen（圆角矩形屏幕内容，不含机身），供 deck 里用 CSS iPhone 边框包裹。
// 这样所有页设备框完整、统一、不被裁。
import { createRequire } from 'module'
const require = createRequire('/Users/xilaiwang/.npm/_npx/e41f203b7505f1fb/node_modules/')
const { chromium } = require('playwright')
const UI = 'http://localhost:5173'
const OUT = '/Users/xilaiwang/Desktop/meituan-pitch-deck/assets/screens'
const CHILD = '.pf-wrap:not(.pf-wrap--parent)'
const PARENT = '.pf-wrap--parent'
import { mkdirSync } from 'fs'
mkdirSync(OUT, { recursive: true })
const sleep = ms => new Promise(r => setTimeout(r, ms))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1480, height: 1040 }, deviceScaleFactor: 3 })
const done = []
async function shot(name, scope) {
  try {
    const el = page.locator(`${scope} .pf-screen`).first()
    await el.waitFor({ state: 'visible', timeout: 8000 })
    await el.screenshot({ path: `${OUT}/${name}.png` })
    done.push(name); process.stdout.write(`✓${name.replace(/^[0-9]+_/, '')} `)
  } catch (e) { console.log('\n✗', name, String(e).split('\n')[0]) }
}
async function clickIn(scope, text) {
  const loc = page.locator(`${scope} button`, { hasText: text }).first()
  await loc.waitFor({ state: 'visible', timeout: 8000 }); await loc.click()
}

await page.goto(UI, { waitUntil: 'networkidle' })
await page.waitForSelector('.xt-promo-card'); await sleep(900)

// 父母端三连（开局，干净）
await shot('20_parent_timeline', PARENT)
await page.locator(`${PARENT} button[aria-label="谁能看到你的记录"]`).click()
await page.waitForSelector(`${PARENT} .pp-person`); await sleep(500)
await shot('21_parent_consent', PARENT)
await page.locator(`${PARENT} .pp-sheet-close`).first().click(); await sleep(400)
await page.locator(`${PARENT} .pp-ask-card`).click()
await page.waitForSelector(`${PARENT} .pp-req-grid`); await sleep(500)
await shot('22_parent_request', PARENT)
await page.locator(`${PARENT} .pp-sheet-close`).first().click(); await sleep(400)

// 子女端：小团首页
await shot('01_onboarding', CHILD)
// 服务流程
await page.locator(`${CHILD} .xt-promo-card`).click()
await page.waitForSelector(`${CHILD} .sf-hero-title`); await sleep(600)
await clickIn(CHILD, '立即开通')
await page.waitForSelector(`${CHILD} .sf-page-title`)
try { await page.locator(`${CHILD} input[placeholder="例如：王秀英"]`).fill('王秀英') } catch {}
await sleep(500); await shot('03_service_form', CHILD)
await clickIn(CHILD, '下一步'); await page.waitForSelector(`${CHILD} .sf-summary`); await sleep(400)
await clickIn(CHILD, '确认支付'); await page.waitForSelector(`${CHILD} .sf-done-title`); await sleep(600)
await shot('05_service_done', CHILD)
await clickIn(CHILD, '查看建档后的效果')
await page.waitForSelector(`${CHILD} .postcard-list`); await sleep(1700)
await shot('06_feed', CHILD)
// 档案
await page.locator(`${CHILD} .feed-profile-card`).click()
await page.waitForSelector(`${CHILD} .ps-title`); await sleep(700)
await shot('07_profile_top', CHILD)
await page.locator(`${CHILD} .ps-scroll`).evaluate(el => el.scrollTo({ top: 560, behavior: 'instant' })); await sleep(500)
await shot('08_profile_meds', CHILD)
await page.locator(`${CHILD} .ps-back`).click(); await sleep(500)
// 关怀 → 药店
await clickIn(CHILD, '帮她在药店补一份')
await page.waitForSelector(`${CHILD} .nl-list`); await sleep(900)
await shot('09_nearby', CHILD)
// 下单
await page.locator(`${CHILD} .nl-select-btn`).first().click()
await page.waitForSelector(`${CHILD} .bm-title`); await sleep(600)
await shot('10_booking_confirm', CHILD)
await page.locator(`${CHILD} .bm-btn--confirm`).click()
await page.waitForSelector(`${CHILD} .bm-success-title`); await sleep(1400)
await shot('11_booking_success', CHILD)
await sleep(700)
await page.locator(`${CHILD} .bm-btn--done`).dispatchEvent('click')
await page.waitForSelector(`${CHILD} .postcard-list`); await sleep(2600)
await shot('12_feed_booked', CHILD)
// 记录 → Agent 轨迹
await clickIn(CHILD, '记录'); await page.waitForSelector(`${CHILD} .trace-pg`); await sleep(700)
await clickIn(CHILD, 'Agent 轨迹'); await page.waitForSelector(`${CHILD} .trace-pg-timeline`); await sleep(900)
await shot('14_trace_agent', CHILD)
// 父母端通知（此时已下单 → 通知出现），滚到顶
await clickIn(CHILD, '明信片'); await sleep(800)
await page.locator(`${PARENT} .pf-app-area`).evaluate(el => el.scrollTo({ top: 0, behavior: 'instant' })).catch(() => {})
await sleep(500)
await shot('23_parent_notif', PARENT)

await browser.close()
console.log(`\nDONE — ${done.length} screens`)
