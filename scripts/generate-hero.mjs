// Renders the homepage hero background: an original, procedurally generated point-cloud / LiDAR scene
// (terrain contours, streets, city blocks, trees) as glowing dots on deep navy.
//
//   node scripts/generate-hero.mjs [--variant=oblique|plan|accent] [--seed=N] [--out=PATH]
//
// The same variant and seed always give the same image. Points are thinned and dimmed in an ellipse behind the
// slide text, so the white text keeps its contrast without a heavy overlay; the script prints the worst-case
// contrast for the text area at phone, small-tablet and desktop crops, and exits with an error below 4.5:1.
import sharp from 'sharp'

const args = process.argv.slice(2)
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback
const variant = option('variant', 'accent')
const seed = Number(option('seed', '7'))
const out = option('out', 'public/images/home/hero-pointcloud-accent.webp')
if (!['oblique', 'plan', 'accent'].includes(variant)) throw new Error(`Unknown variant ${variant}`)

const W = 2400
const H = 1000
// Black overlay the slide puts on top of the image (BannerCarousel `overlay: 'subtle'`), used for the contrast check
const OVERLAY_ALPHA = 0.15

// ---------- random numbers and noise (seeded) ----------
function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(seed)
const between = (a, b) => a + (b - a) * rand()
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand())

// Smooth terrain: a few rotated sine waves, plenty for gentle hills and readable contour lines
const waves = Array.from({ length: 5 }, (_, i) => ({ a: between(0, Math.PI), f: 0.012 * (i + 1) * between(0.7, 1.3), p: between(0, 6.3), amp: 6 / (i + 1) }))
const terrain = (x, z) => waves.reduce((h, w) => h + w.amp * Math.sin((x * Math.cos(w.a) + z * Math.sin(w.a)) * w.f + w.p), 0)

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

// ---------- the calm zone behind the text ----------
// Ellipse centred slightly above the middle (the slide's text block sits a little high, clear of the dots).
// `density` decides whether a point is kept, `brightness` how bright it is drawn.
function calm(sx, sy) {
  const dx = (sx - W * 0.5) / (W * 0.36)
  const dy = (sy - H * 0.47) / (H * 0.58)
  const d = Math.sqrt(dx * dx + dy * dy)
  return { density: 0.35 + 0.65 * smoothstep(0.35, 1.05, d), brightness: 0.3 + 0.7 * smoothstep(0.4, 1.15, d) }
}

// ---------- splatting ----------
const acc = new Float32Array(W * H * 3)
function splat(sx, sy, color, intensity, radius) {
  if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) return
  const c = calm(sx, sy)
  if (rand() > c.density) return
  const k = intensity * c.brightness
  const r = Math.ceil(radius * 2)
  const inv = 1 / (2 * radius * radius)
  for (let y = Math.max(0, Math.floor(sy - r)); y <= Math.min(H - 1, Math.ceil(sy + r)); y++) {
    for (let x = Math.max(0, Math.floor(sx - r)); x <= Math.min(W - 1, Math.ceil(sx + r)); x++) {
      const w = k * Math.exp(-((x - sx) ** 2 + (y - sy) ** 2) * inv)
      if (w < 0.002) continue
      const i = (y * W + x) * 3
      acc[i] += color[0] * w
      acc[i + 1] += color[1] * w
      acc[i + 2] += color[2] * w
    }
  }
}

// ---------- palette (linear-ish RGB, 0..1) ----------
const C = {
  ground: [0.1, 0.2, 0.42],
  contour: [0.16, 0.78, 0.6],
  kerb: [0.3, 0.5, 0.95],
  low: [0.12, 0.38, 0.98],
  high: [0.62, 0.88, 1.0],
  peak: [0.92, 0.97, 1.0],
  leaf: [0.2, 0.86, 0.45],
  leafLight: [0.55, 0.98, 0.55],
  accent: [1.0, 0.12, 0.5], // the site's pink, for the 'accent' variant
}

// ---------- the city (shared by all variants) ----------
// World units are metres-ish. A street grid of blocks; each block holds a few buildings or is a park.
function buildCity(xRange, zRange) {
  const buildings = []
  const trees = []
  const streets = []
  const block = 34
  const street = 9
  for (let bx = xRange[0]; bx < xRange[1]; bx += block + street) {
    streets.push({ axis: 'x', at: bx - street / 2, from: zRange[0], to: zRange[1] })
    for (let bz = zRange[0]; bz < zRange[1]; bz += block + street) {
      if (bx === xRange[0]) streets.push({ axis: 'z', at: bz - street / 2, from: xRange[0], to: xRange[1] })
      // A dense core towards the back-centre, lower buildings and more parks outside it
      const core = Math.exp(-((bx / 160) ** 2 + ((bz - 170) / 140) ** 2))
      if (rand() < 0.16 - core * 0.1) {
        for (let t = 0; t < 26; t++) trees.push({ x: bx + between(3, block - 3), z: bz + between(3, block - 3), r: between(1.6, 3.4) })
        continue
      }
      const split = rand() < 0.5 ? 2 : 3
      const w = block / split
      for (let i = 0; i < split; i++) {
        for (let j = 0; j < 2; j++) {
          if (rand() < 0.12) continue
          const h = 4 + Math.pow(rand(), 2.2) * (14 + core * 70)
          buildings.push({ x0: bx + i * w + 1.2, x1: bx + (i + 1) * w - 1.2, z0: bz + j * (block / 2) + 1.2, z1: bz + (j + 1) * (block / 2) - 1.2, h })
        }
      }
      // Street trees along the block's front edge
      for (let t = 0; t < 5; t++) trees.push({ x: bx + between(1, block - 1), z: bz - street * 0.3, r: between(1.2, 2.2) })
    }
  }
  const tallest = [...buildings].sort((a, b) => b.h - a.h)[Math.floor(buildings.length * 0.06)]?.h ?? Infinity
  return { buildings, trees, streets, tallest }
}

// ---------- variant: oblique aerial view (perspective) ----------
function renderOblique({ accent }) {
  const camH = 140
  const pitch = (40 * Math.PI) / 180
  const F = 1500
  const [sp, cp] = [Math.sin(pitch), Math.cos(pitch)]
  const project = (X, Y, Z) => {
    const yRel = Y - camH
    const zf = -yRel * sp + Z * cp
    if (zf < 1) return null
    const yu = yRel * cp + Z * sp
    return { sx: W / 2 + (F * X) / zf, sy: H / 2 - (F * yu) / zf, zf }
  }
  // Points fade into the navy with distance, which also stops the far rows piling up into a bright band
  const fade = (zf) => 1 / (1 + (zf / 520) ** 2)
  const put = (X, Y, Z, color, intensity, size = 1) => {
    const p = project(X, Y, Z)
    if (!p) return
    splat(p.sx, p.sy, color, intensity * fade(p.zf), size * Math.min(1.1, Math.max(0.6, 160 / p.zf)))
  }

  // Starting at -361 centres a block (not a street) on X = 0, so no street runs straight up the middle
  const city = buildCity([-361, 361], [40, 440])
  const ground = (x, z) => terrain(x, z) * 0.35

  // Ground returns, with brighter points on the terrain contour lines
  for (let z = 40; z < 440; z += 1.4) {
    for (let x = -360; x < 360; x += 1.4) {
      const jx = x + between(-0.5, 0.5)
      const jz = z + between(-0.5, 0.5)
      const h = terrain(jx, jz)
      const onContour = Math.abs(h - Math.round(h / 1.5) * 1.5) < 0.09
      if (onContour) put(jx, ground(jx, jz), jz, C.contour, 0.9)
      else if (rand() < 0.3) put(jx, ground(jx, jz), jz, C.ground, 0.55)
    }
  }
  // Kerb lines along every street
  for (const s of city.streets) {
    for (let t = s.from; t < s.to; t += 0.8) {
      for (const off of [-4, 4]) {
        const [x, z] = s.axis === 'x' ? [s.at + off, t] : [t, s.at + off]
        put(x, ground(x, z) + 0.15, z, C.kerb, 0.6)
      }
    }
  }
  // Buildings: dense roofs, plus horizontal scan lines on the walls that face the camera
  for (const b of city.buildings) {
    const base = ground((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2)
    const top = base + b.h
    const tone = smoothstep(4, 70, b.h)
    const heightColor = (y) => {
      const t = smoothstep(0, 70, y - base)
      return t < 0.6 ? mix(C.low, C.high, t / 0.6) : mix(C.high, C.peak, (t - 0.6) / 0.4)
    }
    const roofColor = accent && b.h >= city.tallest ? C.accent : heightColor(top)
    for (let x = b.x0; x <= b.x1; x += 1.0) for (let z = b.z0; z <= b.z1; z += 1.0) put(x + between(-0.25, 0.25), top, z + between(-0.25, 0.25), roofColor, 1.1)
    // Roof outline, a little denser so each building reads as a block
    for (let x = b.x0; x <= b.x1; x += 0.5) for (const z of [b.z0, b.z1]) put(x, top, z, roofColor, 1.1)
    for (let z = b.z0; z <= b.z1; z += 0.5) for (const x of [b.x0, b.x1]) put(x, top, z, roofColor, 1.1)
    for (let y = base; y <= top; y += 1.6) {
      const wall = heightColor(y)
      for (let x = b.x0; x <= b.x1; x += 0.8) put(x, y, b.z0, wall, 0.55 + tone * 0.2)
      const side = b.x0 > 0 ? b.x0 : b.x1 < 0 ? b.x1 : null
      if (side !== null) for (let z = b.z0; z <= b.z1; z += 0.8) put(side, y, z, wall, 0.4 + tone * 0.15)
    }
  }
  // Trees: round clusters of green returns
  for (const t of city.trees) {
    const base = ground(t.x, t.z)
    for (let i = 0; i < 70; i++) {
      const u = [gauss(), gauss(), gauss()]
      const n = Math.hypot(...u) || 1
      const rr = t.r * Math.cbrt(rand())
      put(t.x + (u[0] / n) * rr, base + t.r * 1.6 + (u[1] / n) * rr * 0.8, t.z + (u[2] / n) * rr, mix(C.leaf, C.leafLight, rand() * 0.6), 1.0)
    }
  }
  // Accent variant: a scanner sweep, an arc of pink returns across the ground
  if (accent) {
    for (const r of [210, 330]) {
      for (let a = -1.3; a < 1.3; a += 0.0009) {
        const x = Math.sin(a) * r
        const z = 30 + Math.cos(a) * r
        put(x, ground(x, z) + 0.3, z, C.accent, 1.4, 1.1)
      }
    }
  }
}

// ---------- variant: top-down plan, like a scanned city map ----------
function renderPlan() {
  const scale = 3.1 // px per world unit
  const rot = (17 * Math.PI) / 180
  const [sr, cr] = [Math.sin(rot), Math.cos(rot)]
  const put = (X, Z, color, intensity, size = 1.1) => splat(W / 2 + (X * cr - Z * sr) * scale, H / 2 + (X * sr + Z * cr) * scale, color, intensity, size)

  const span = 520
  const city = buildCity([-span, span], [-span, span])
  // Sparse ground returns and contour lines
  for (let z = -span; z < span; z += 1.1) {
    for (let x = -span; x < span; x += 1.1) {
      const h = terrain(x, z)
      if (Math.abs(h - Math.round(h / 1.2) * 1.2) < 0.05) put(x, z, C.contour, 0.4, 0.9)
      else if (rand() < 0.05) put(x + between(-0.5, 0.5), z + between(-0.5, 0.5), C.ground, 0.4, 0.8)
    }
  }
  for (const s of city.streets) {
    for (let t = s.from; t < s.to; t += 1.0) {
      for (const off of [-4, 4]) put(...(s.axis === 'x' ? [s.at + off, t] : [t, s.at + off]), C.kerb, 0.35, 0.8)
    }
  }
  // Building footprints: filled with points, brighter and lighter the taller the building
  for (const b of city.buildings) {
    const tone = smoothstep(4, 60, b.h)
    const color = tone < 0.6 ? mix(C.low, C.high, tone / 0.6) : mix(C.high, C.peak, (tone - 0.6) / 0.4)
    const spacing = 1.9 - tone * 0.5
    for (let x = b.x0 + 0.4; x <= b.x1; x += spacing) for (let z = b.z0 + 0.4; z <= b.z1; z += spacing) put(x + between(-0.15, 0.15), z + between(-0.15, 0.15), color, 0.5 + tone * 0.45, 0.85)
  }
  for (const t of city.trees) {
    for (let i = 0; i < 40; i++) {
      const a = rand() * 2 * Math.PI
      const rr = t.r * Math.sqrt(rand())
      put(t.x + Math.cos(a) * rr, t.z + Math.sin(a) * rr, mix(C.leaf, C.leafLight, rand() * 0.5), 0.6, 0.85)
    }
  }
}

if (variant === 'plan') renderPlan()
else renderOblique({ accent: variant === 'accent' })

// ---------- glow: two blurred copies added back (tight halo + soft bloom) ----------
function blur(src, radius, passes = 3) {
  let a = Float32Array.from(src)
  let b = new Float32Array(a.length)
  const win = radius * 2 + 1
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < H; y++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0
        for (let x = -radius; x <= radius; x++) sum += a[(y * W + Math.min(W - 1, Math.max(0, x))) * 3 + c]
        for (let x = 0; x < W; x++) {
          b[(y * W + x) * 3 + c] = sum / win
          sum += a[(y * W + Math.min(W - 1, x + radius + 1)) * 3 + c] - a[(y * W + Math.max(0, x - radius)) * 3 + c]
        }
      }
    }
    for (let x = 0; x < W; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0
        for (let y = -radius; y <= radius; y++) sum += b[(Math.min(H - 1, Math.max(0, y)) * W + x) * 3 + c]
        for (let y = 0; y < H; y++) {
          a[(y * W + x) * 3 + c] = sum / win
          sum += b[(Math.min(H - 1, y + radius + 1) * W + x) * 3 + c] - b[(Math.max(0, y - radius) * W + x) * 3 + c]
        }
      }
    }
  }
  return a
}
const halo = blur(acc, 2)
const bloom = blur(acc, 12)

// ---------- compose on navy, tone-map, dither ----------
const navyCentre = [5, 12, 34] // #050c22
const navyEdge = [10, 22, 58] // #0a163a
const pixels = Buffer.alloc(W * H * 3)
const lum = new Float32Array(W * H) // relative luminance after the slide's overlay, for the contrast check
const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x
    const e = smoothstep(0.2, 1.1, Math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2)))
    const rgb = [0, 0, 0]
    for (let c = 0; c < 3; c++) {
      const bg = (navyCentre[c] + (navyEdge[c] - navyCentre[c]) * e) / 255
      const light = acc[i * 3 + c] * 1.0 + halo[i * 3 + c] * 0.7 + bloom[i * 3 + c] * 0.6
      const v = 1 - (1 - bg) * Math.exp(-light) // soft clip: bright clusters roll off instead of clipping
      const q = Math.min(255, Math.max(0, Math.round(v * 255 + (rand() - 0.5))))
      pixels[i * 3 + c] = q
      rgb[c] = toLinear((q / 255) * (1 - OVERLAY_ALPHA))
    }
    lum[i] = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }
}

// ---------- contrast check: white text over the text area at each crop ----------
// Each crop is the slide box (object-cover, centred) at that viewport, and the box around the slide's text in CSS px.
const crops = [
  { name: 'phone 375px', box: [343, 420], text: [48, 20, 295, 385] },
  { name: 'tablet 640px', box: [592, 520], text: [48, 60, 544, 470] },
  { name: 'desktop 1280px', box: [1024, 430], text: [176, 90, 848, 360] },
]
let worst = Infinity
for (const crop of crops) {
  const s = Math.max(crop.box[0] / W, crop.box[1] / H)
  const ox = (W * s - crop.box[0]) / 2
  const oy = (H * s - crop.box[1]) / 2
  const [x0, y0, x1, y1] = crop.text.map((v, k) => Math.round((v + (k % 2 === 0 ? ox : oy)) / s))
  const values = []
  for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) values.push(lum[y * W + x])
  values.sort((a, b) => a - b)
  const p99 = values[Math.floor(values.length * 0.99)]
  const median = values[Math.floor(values.length * 0.5)]
  const ratio = 1.05 / (p99 + 0.05)
  worst = Math.min(worst, ratio)
  console.log(`${crop.name.padEnd(15)} white text vs background: ${ratio.toFixed(2)}:1 at the brightest 1% (${(1.05 / (median + 0.05)).toFixed(1)}:1 typical)`)
}

const info = await sharp(pixels, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 78, effort: 6, smartSubsample: true })
  .toFile(out)
console.log(`${out}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB (variant ${variant}, seed ${seed})`)
if (info.size > 400 * 1024) console.warn('Warning: over the 400 KB budget')
if (worst < 4.5) {
  console.error(`Contrast ${worst.toFixed(2)}:1 is below 4.5:1`)
  process.exitCode = 1
}
