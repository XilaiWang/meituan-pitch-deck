import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const require = createRequire('/Users/xilaiwang/.npm/_npx/e41f203b7505f1fb/node_modules/')
const { chromium } = require('playwright')
const DIR = dirname(fileURLToPath(import.meta.url))
const URL = 'file://' + resolve(DIR, 'index.html')
import { mkdirSync } from 'fs'
mkdirSync(resolve(DIR, 'assets/diag'), { recursive: true })

const browser = await chromium.launch()
// 实况模式（不 reduced），等动画跑完
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
for (const n of [10, 12]) {
  await page.goto(`${URL}?slide=${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2800)
  const boxes = await page.evaluate(() => {
    const s = document.querySelector('.slide.active')
    const out = {}
    for (const sel of ['.row', '.visual', '.text']) {
      const el = s.querySelector(sel)
      if (el) { const b = el.getBoundingClientRect(); out[sel] = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } }
    }
    const vis = s.querySelector('.visual')
    out.visualStyle = vis ? vis.getAttribute('style') : null
    out.visualTransform = vis ? getComputedStyle(vis).transform : null
    out.visualPosition = vis ? getComputedStyle(vis).position : null
    out.visualHeightCSS = vis ? getComputedStyle(vis).height : null
    return out
  })
  console.log(`\n=== slide ${n} (live, settled) ===`)
  console.log(JSON.stringify(boxes, null, 1))
  await page.locator('#stage').screenshot({ path: `${DIR}/assets/diag/live-${n}.png` })
}
await browser.close()
