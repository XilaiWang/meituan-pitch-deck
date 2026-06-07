// 全量实况排查：实况模式(非 reduced)渲染全部 17 页到 render-live/，并检测每页元素是否
// 越界(超出舞台)或与文字重叠的迹象，最后拼成一张检查图。
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
const TOTAL = 19

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
const issues = []
for (let n = 1; n <= TOTAL; n++) {
  await page.goto(`${URL}?slide=${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2600)
  const rep = await page.evaluate(() => {
    const s = document.querySelector('.slide.active')
    const SW = 1280, SH = 720
    const r = []
    // 1) 越界检测：可见元素是否大幅超出舞台
    s.querySelectorAll('.device,.visual,.dualshot,.pcimg,.tiers,.growth,.metrics,.flow,.h1,.h2,.big,.num,.quote').forEach(el => {
      const b = el.getBoundingClientRect()
      if (b.width === 0 && b.height === 0) return
      if (b.left < -8 || b.top < -8 || b.right > SW + 8 || b.bottom > SH + 8) {
        r.push(`越界 ${el.className.split(' ')[0]} [${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}x${Math.round(b.height)}]`)
      }
    })
    // 2) 文字↔设备重叠检测：.text 与 .visual 的矩形是否相交
    const t = s.querySelector('.text'), v = s.querySelector('.visual')
    if (t && v) {
      const a = t.getBoundingClientRect(), b = v.getBoundingClientRect()
      const ix = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      const iy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
      if (ix > 30 && iy > 30 && b.width > 0) r.push(`文字与设备重叠 ${Math.round(ix)}x${Math.round(iy)}`)
    }
    return r
  })
  if (rep.length) issues.push(`S${n}: ${rep.join(' | ')}`)
  await page.locator('#stage').screenshot({ path: `${OUT}/live-${String(n).padStart(2, '0')}.png` })
  process.stdout.write(`✓${n} `)
}
await browser.close()
console.log('\n' + (issues.length ? 'ISSUES:\n' + issues.join('\n') : '✅ 全部 '+TOTAL+' 页：无越界 / 无文字-设备重叠'))
