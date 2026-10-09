// Screenshots of a running site at exact viewport widths, using headless Edge/Chrome over the DevTools protocol.
// No dependencies: Node 22 has fetch and WebSocket built in.
//
//   node scripts/screenshot.mjs / /events/kick-off [options]
//
//   --base=URL        site to capture (default http://localhost:3000, the dev server)
//   --widths=375,1280 viewport widths in CSS px (default 375,1280)
//   --slide=N         homepage carousel: show slide N before capturing
//   --selector=CSS    capture only the first element matching CSS
//   --full            capture the whole page instead of the first 900px
//   --out=DIR         output folder (default <os tmp>/geos-screenshots)
//
// Set CHROME_PATH to use a browser other than the ones listed in `candidates`.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const args = process.argv.slice(2)
const option = (name, fallback) =>
  args
    .find((a) => a.startsWith(`--${name}=`))
    ?.split('=')
    .slice(1)
    .join('=') ?? fallback
const paths = args.filter((a) => !a.startsWith('--'))
if (paths.length === 0) {
  console.error('Usage: node scripts/screenshot.mjs <path> [<path> ...] [--base=URL] [--widths=375,1280] [--slide=N] [--selector=CSS] [--full] [--out=DIR]')
  process.exit(1)
}
const base = option('base', 'http://localhost:3000')
const widths = option('widths', '375,1280').split(',').map(Number)
const slide = option('slide')
const selector = option('selector')
const full = args.includes('--full')
const outDir = option('out', join(tmpdir(), 'geos-screenshots'))
mkdirSync(outDir, { recursive: true })

try {
  await fetch(base, { signal: AbortSignal.timeout(60000) })
} catch {
  console.error(`Nothing is responding at ${base}. Start the dev server first (npm run dev), or pass --base.`)
  process.exit(1)
}

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]
const browserPath = candidates.find((p) => p && existsSync(p))
if (!browserPath) {
  console.error('No Edge or Chrome found. Set CHROME_PATH.')
  process.exit(1)
}

const port = 9333
const browser = spawn(browserPath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), 'geos-screenshot-profile')}`, '--hide-scrollbars', 'about:blank'], {
  stdio: 'ignore',
})
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let wsUrl
for (let i = 0; i < 50 && !wsUrl; i++) {
  try {
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
    wsUrl = targets.find((t) => t.type === 'page')?.webSocketDebuggerUrl
  } catch {
    // browser not listening yet
  }
  if (!wsUrl) await sleep(200)
}
if (!wsUrl) {
  console.error('Could not connect to the headless browser.')
  browser.kill()
  process.exit(1)
}

const ws = new WebSocket(wsUrl)
await new Promise((resolve) => (ws.onopen = resolve))
let nextId = 0
const pending = new Map()
const listeners = []
ws.onmessage = ({ data }) => {
  const msg = JSON.parse(data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  } else if (msg.method) {
    listeners.filter((l) => l.method === msg.method).forEach((l) => l.resolve(msg))
  }
}
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })
const nextEvent = (method, timeoutMs = 30000) =>
  new Promise((resolve, reject) => {
    const stopListening = () => {
      listeners.splice(listeners.indexOf(listener), 1)
      clearTimeout(timer)
    }
    const listener = {
      method,
      resolve: (msg) => {
        stopListening()
        resolve(msg)
      },
    }
    const timer = setTimeout(() => {
      stopListening()
      reject(new Error(`${method} timed out after ${timeoutMs / 1000}s`))
    }, timeoutMs)
    listeners.push(listener)
  })
const evaluate = async (expression) => {
  const { result } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? 'evaluation failed')
  return result.result.value
}

await send('Page.enable')
let failed = false
for (const path of paths) {
  for (const width of widths) {
    try {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 })
      const loaded = nextEvent('Page.loadEventFired')
      const { result: navigation } = await send('Page.navigate', { url: base + path })
      if (navigation.errorText) {
        loaded.catch(() => {})
        throw new Error(`could not load ${base + path} (${navigation.errorText})`)
      }
      await loaded
      await sleep(2000)

      // Images below the fold load lazily: scroll through the page so they load, then wait for them.
      // The dev server optimises each image size on first request, which can take a while.
      await evaluate(`(async () => {
        document.documentElement.style.scrollBehavior = 'auto'
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 100))
        }
        scrollTo(0, 0)
        const deadline = Date.now() + 20000
        while ([...document.images].some((img) => !img.complete) && Date.now() < deadline) await new Promise((r) => setTimeout(r, 200))
      })()`)

      // Last step before capturing: carousel autoplay moves on every 6s
      if (slide) {
        // Clicks before hydration are ignored, so click until the slide's dot turns active (solid bg-white, not bg-white/50)
        const dot = `document.querySelector('[aria-label="Go to slide ${slide}"]')`
        let active = false
        for (let i = 0; i < 20 && !active; i++) {
          await evaluate(`${dot}.click()`)
          await sleep(300)
          active = await evaluate(`${dot}.classList.contains('bg-white')`)
        }
        if (!active) throw new Error(`carousel did not move to slide ${slide}`)
        await sleep(1000) // slide transition is 700ms
      }

      // Area to capture, in page coordinates
      const area = JSON.parse(
        await evaluate(`(() => {
          const sel = ${JSON.stringify(selector ?? null)}
          const el = sel && document.querySelector(sel)
          if (sel && !el) throw new Error('No element matches ' + sel)
          if (el) {
            const r = el.getBoundingClientRect()
            return JSON.stringify({ x: 0, y: Math.max(0, r.top + scrollY - 10), width: innerWidth, height: r.height + 20 })
          }
          return JSON.stringify({ x: 0, y: 0, width: innerWidth, height: ${full} ? document.documentElement.scrollHeight : 900 })
        })()`)
      )
      const { result } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...area, scale: 1 } })

      const name = `${path.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '_') || 'home'}-${width}${slide ? `-slide${slide}` : ''}.png`
      writeFileSync(join(outDir, name), Buffer.from(result.data, 'base64'))
      console.log(join(outDir, name))
    } catch (error) {
      failed = true
      console.error(`${path} @ ${width}px: ${error.message}`)
    }
  }
}

ws.close()
browser.kill()
process.exit(failed ? 1 : 0)
