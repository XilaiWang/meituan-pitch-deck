// 实况动画终态校验：不开 reduced-motion，等动画跑完再截图，确认元素都可见（无残留隐藏）。
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const require = createRequire('/Users/xilaiwang/.npm/_npx/e41f203b7505f1fb/node_modules/')
const { chromium } = require('playwright')
const DIR = dirname(fileURLToPath(import.meta.url))
const URL = 'file://' + resolve(DIR, 'index.html')
const OUT = resolve(DIR, 'assets/render-live')
import { mkdirSync } from 'fs'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
const errs = []
page.on('pageerror', e => errs.push(String(e).slice(0, 140)))
for (const n of [1, 14, 15, 16]) {
  await page.goto(`${URL}?slide=${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2800) // 等 GSAP 动画完全落定
  // 检查本页所有 .r / figure 是否有残留 opacity 0
  const hidden = await page.evaluate(() => {
    const s = document.querySelector('.slide.active')
    const els = s.querySelectorAll('.r, .cards2 figure, .callout, .node, .dualshot')
    let bad = 0
    els.forEach(e => { if (parseFloat(getComputedStyle(e).opacity) < 0.9) bad++ })
    return bad
  })
  await page.locator('#stage').screenshot({ path: `${OUT}/live-${String(n).padStart(2, '0')}.png` })
  console.log(`slide ${n}: hidden-after-anim=${hidden}`)
}
await browser.close()
console.log(errs.length ? 'PAGEERR:\n' + errs.join('\n') : 'no page errors')
