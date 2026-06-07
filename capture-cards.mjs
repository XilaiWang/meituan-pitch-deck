// 单独采集两张明信片卡片：清淡午餐(情感) + 降压药(行动)，给 S7「两张明信片」用。
import { createRequire } from 'module'
const require = createRequire('/Users/xilaiwang/.npm/_npx/e41f203b7505f1fb/node_modules/')
const { chromium } = require('playwright')
const UI = 'http://localhost:5173'
const OUT = '/Users/xilaiwang/Desktop/meituan-pitch-deck/assets/shots'
const CHILD = '.pf-wrap:not(.pf-wrap--parent)'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1480, height: 1040 }, deviceScaleFactor: 2 })
await page.goto(UI, { waitUntil: 'networkidle' })
await page.waitForSelector('.xt-promo-card')
await sleep(700)
// 走到 authorized feed
await page.locator(`${CHILD} .xt-promo-card`).click()
await page.waitForSelector(`${CHILD} .sf-hero-title`)
for (const t of ['立即开通', '下一步', '确认支付', '查看建档后的效果']) {
  await page.locator(`${CHILD} button`, { hasText: t }).first().click()
  await sleep(500)
}
await page.waitForSelector(`${CHILD} .postcard-list`)
await sleep(1800) // BlurText 落定

async function shotCard(name, text) {
  const card = page.locator(`${CHILD} .pc-card`, { hasText: text }).first()
  await card.scrollIntoViewIfNeeded()
  await sleep(1700) // 等 BlurText 标题逐字落定（卡片滚入视口会重新触发动画）
  await card.screenshot({ path: `${OUT}/${name}.png` })
  console.log('✓', name)
}
await shotCard('card_meal', '清淡午餐')      // 情感明信片
await shotCard('card_medicine', '降压药')    // 行动明信片
await browser.close()
console.log('done')
