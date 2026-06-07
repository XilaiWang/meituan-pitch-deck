// 把 deck 的每一页渲染成 1280x720 PNG（reduced-motion 让动画落定终态）。
// 既用于人工校验，也作为 PPTX/PDF 导出的素材。
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const require = createRequire('/Users/xilaiwang/.npm/_npx/e41f203b7505f1fb/node_modules/')
const { chromium } = require('playwright')

const DIR = dirname(fileURLToPath(import.meta.url))
const URL = 'file://' + resolve(DIR, 'index.html')
const OUT = resolve(DIR, 'assets/render')
const TOTAL = 19

import { mkdirSync } from 'fs'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
})
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })
page.on('pageerror', e => errors.push('PAGEERR ' + String(e).slice(0, 160)))

for (let n = 1; n <= TOTAL; n++) {
  await page.goto(`${URL}?slide=${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(450)
  const el = page.locator('#stage')
  await el.screenshot({ path: `${OUT}/slide-${String(n).padStart(2, '0')}.png` })
  process.stdout.write(`✓${n} `)
}
await browser.close()
console.log('\nrendered', TOTAL, 'slides ->', OUT)
if (errors.length) console.log('CONSOLE/PAGE ERRORS:\n' + [...new Set(errors)].join('\n'))
else console.log('no console errors')
