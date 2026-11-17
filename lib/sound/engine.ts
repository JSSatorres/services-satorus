/**
 * Sonido de la web, sintetizado en el navegador con Web Audio: no hay
 * archivos que descargar ni licencias, y todos los sonidos comparten familia
 * (re mayor pentatónica, timbres suaves de madera y cristal).
 *
 * Reglas:
 * - Apagado por defecto. Sólo suena si la persona lo activa (botón del
 *   header); su elección se guarda en `localStorage`.
 * - El navegador no deja sonar nada antes de un clic o una tecla: el
 *   `AudioContext` se crea y se desbloquea en el primer gesto.
 * - Nunca con movimiento reducido, ni con la pestaña oculta.
 * - Cada sonido tiene su propio freno (no se repite más rápido que su
 *   intervalo) y hay un tope global, así un scroll muy rápido no suena a
 *   metralleta.
 */

export type SoundName =
  | "hover"
  | "click"
  | "tick"
  | "pop"
  | "whoosh"
  | "suck"
  | "boom"
  | "snap"
  | "card"
  | "rise"
  | "chime"
  | "notify"
  | "swap"
  | "toggle"

export type PlayOptions = {
  /** Multiplica el volumen del sonido (1 = normal). */
  volume?: number
  /** Nota dentro de la escala, para series que suben (0 = re). */
  note?: number
}

const STORAGE_KEY = "satorus-sound"
const MASTER = 0.38

/** Re mayor pentatónica desde re4. */
const SCALE = [293.66, 329.63, 369.99, 440, 493.88]
const noteFreq = (index: number) => {
  const octave = Math.floor(index / SCALE.length)
  const step = ((index % SCALE.length) + SCALE.length) % SCALE.length
  return SCALE[step] * 2 ** octave
}

/** Lo mínimo que tiene que pasar entre dos veces el mismo sonido (ms). */
const MIN_GAP: Record<SoundName, number> = {
  hover: 70,
  click: 60,
  tick: 45,
  pop: 40,
  whoosh: 180,
  suck: 300,
  boom: 700,
  snap: 250,
  card: 140,
  rise: 400,
  chime: 90,
  notify: 160,
  swap: 220,
  toggle: 0,
}

type Engine = {
  ctx: AudioContext
  out: GainNode
  reverb: GainNode
  noise: AudioBuffer
}

let engine: Engine | null = null
let enabled = false
let loaded = false
let quietUntil = 0
const lastPlayed = new Map<SoundName, number>()
let recent: number[] = []
const listeners = new Set<() => void>()

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

function load() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) === "on" && !reducedMotion()
  } catch {
    enabled = false
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

/* ------------------------------------------------------------ Estado */

export function subscribeSound(listener: () => void) {
  load()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function isSoundEnabled() {
  load()
  return enabled
}

/** Llamar SIEMPRE desde un clic: es el gesto que desbloquea el audio. */
export function setSoundEnabled(value: boolean) {
  load()
  enabled = value && !reducedMotion()
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off")
  } catch {
    /* sin almacenamiento: sólo dura esta visita */
  }
  if (enabled) unlockSound()
  emit()
}

/** Silencio durante unos ms (p. ej. mientras ScrollTrigger vuelve a medir y salta). */
export function hushSound(ms: number) {
  quietUntil = Math.max(quietUntil, performance.now() + ms)
}

/** Corta un `hushSound` antes de tiempo (p. ej. al terminar un salto de scroll). */
export function releaseHush() {
  quietUntil = 0
}

/* ------------------------------------------------------------ Motor */

function build(): Engine | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  const ctx = new Ctor({ latencyHint: "interactive" })

  // Salida: volumen general → compresor suave (que nada pegue de golpe).
  const out = ctx.createGain()
  out.gain.value = MASTER
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.knee.value = 12
  comp.ratio.value = 3
  comp.attack.value = 0.004
  comp.release.value = 0.2
  out.connect(comp).connect(ctx.destination)

  // Reverberación corta generada (sala pequeña): da el brillo «caro».
  const convolver = ctx.createConvolver()
  const length = Math.floor(ctx.sampleRate * 1.4)
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3.2
  }
  convolver.buffer = impulse
  const reverb = ctx.createGain()
  reverb.gain.value = 0.32
  reverb.connect(convolver).connect(out)

  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  return { ctx, out, reverb, noise }
}

/** Crea o reanuda el audio. Sólo funciona dentro de un gesto del usuario. */
export function unlockSound() {
  if (typeof window === "undefined" || !enabled) return
  if (!engine) engine = build()
  if (!engine) return
  const { ctx } = engine
  if (ctx.state === "running") return
  void ctx.resume().catch(() => {})
  // iOS: un búfer en silencio dentro del gesto termina de abrir la salida.
  const silent = ctx.createBufferSource()
  silent.buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
  silent.connect(ctx.destination)
  silent.start()
}

/* --------------------------------------------------- Piezas de sonido */

const vary = (amount: number) => 1 + (Math.random() * 2 - 1) * amount

type ToneSpec = {
  freq: number
  to?: number
  type?: OscillatorType
  at?: number
  attack?: number
  dur: number
  peak: number
  glide?: number
  wet?: number
}

function tone(e: Engine, spec: ToneSpec) {
  const { ctx } = e
  const t = ctx.currentTime + 0.005 + (spec.at ?? 0)
  const osc = ctx.createOscillator()
  osc.type = spec.type ?? "sine"
  osc.frequency.setValueAtTime(spec.freq, t)
  if (spec.to) osc.frequency.exponentialRampToValueAtTime(spec.to, t + (spec.glide ?? spec.dur))
  const gain = ctx.createGain()
  const attack = spec.attack ?? 0.004
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(spec.peak, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + spec.dur)
  osc.connect(gain)
  gain.connect(e.out)
  if (spec.wet) {
    const send = ctx.createGain()
    send.gain.value = spec.wet
    gain.connect(send).connect(e.reverb)
  }
  osc.start(t)
  osc.stop(t + attack + spec.dur + 0.05)
}

type NoiseSpec = {
  filter?: BiquadFilterType
  from: number
  to?: number
  q?: number
  at?: number
  attack?: number
  dur: number
  peak: number
  wet?: number
}

function noise(e: Engine, spec: NoiseSpec) {
  const { ctx } = e
  const t = ctx.currentTime + 0.005 + (spec.at ?? 0)
  const src = ctx.createBufferSource()
  src.buffer = e.noise
  src.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = spec.filter ?? "bandpass"
  filter.Q.value = spec.q ?? 1
  filter.frequency.setValueAtTime(spec.from, t)
  const attack = spec.attack ?? 0.005
  if (spec.to) filter.frequency.exponentialRampToValueAtTime(spec.to, t + attack + spec.dur)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(spec.peak, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + spec.dur)
  src.connect(filter).connect(gain)
  gain.connect(e.out)
  if (spec.wet) {
    const send = ctx.createGain()
    send.gain.value = spec.wet
    gain.connect(send).connect(e.reverb)
  }
  src.start(t, Math.random() * 0.5)
  src.stop(t + attack + spec.dur + 0.05)
}

/* -------------------------------------------------------- Catálogo */

const SOUNDS: Record<SoundName, (e: Engine, v: number, opts: PlayOptions) => void> = {
  // Roce casi imperceptible al pasar por encima de un botón.
  hover: (e, v) => {
    tone(e, { freq: 2350 * vary(0.05), type: "sine", dur: 0.03, peak: 0.035 * v })
  },
  // Pulsación: un toque de madera con brillo.
  click: (e, v) => {
    tone(e, { freq: noteFreq(8) * vary(0.02), to: noteFreq(7), type: "triangle", dur: 0.07, peak: 0.1 * v, glide: 0.05 })
    noise(e, { filter: "highpass", from: 3200, dur: 0.018, peak: 0.05 * v })
  },
  // Tic de rueda: cada paso, un poco más agudo.
  tick: (e, v, { note = 0 }) => {
    const f = noteFreq(10 + note) * vary(0.02)
    tone(e, { freq: f, to: f * 0.8, type: "triangle", dur: 0.05, peak: 0.12 * v, glide: 0.04, wet: 0.25 })
    noise(e, { from: 2600, q: 3, dur: 0.025, peak: 0.08 * v })
  },
  // Burbuja: sube un pelín al nacer. Con `note` hace escalas.
  pop: (e, v, { note = 5 }) => {
    const f = noteFreq(note) * vary(0.015)
    tone(e, { freq: f * 0.72, to: f, type: "sine", dur: 0.13, peak: 0.16 * v, glide: 0.025, wet: 0.35 })
    tone(e, { freq: f * 2, type: "sine", at: 0.004, dur: 0.06, peak: 0.03 * v })
  },
  // Aire que pasa (sube).
  whoosh: (e, v) => {
    noise(e, { from: 380 * vary(0.08), to: 2600 * vary(0.08), q: 0.9, attack: 0.16, dur: 0.38, peak: 0.2 * v, wet: 0.4 })
  },
  // Aire que se aspira hacia dentro (baja y se cierra).
  suck: (e, v) => {
    noise(e, { from: 3200, to: 260, q: 1.4, attack: 0.25, dur: 0.22, peak: 0.18 * v, wet: 0.3 })
    tone(e, { freq: noteFreq(7), to: noteFreq(0), type: "sine", attack: 0.2, dur: 0.25, peak: 0.04 * v, glide: 0.45 })
  },
  // Golpe grave con cola: el zoom a través del punto.
  boom: (e, v) => {
    tone(e, { freq: 120, to: 38, type: "sine", attack: 0.006, dur: 0.7, peak: 0.55 * v, glide: 0.45 })
    noise(e, { filter: "lowpass", from: 1400, to: 160, q: 0.6, attack: 0.01, dur: 0.5, peak: 0.16 * v, wet: 0.6 })
    tone(e, { freq: noteFreq(5), type: "sine", at: 0.04, attack: 0.03, dur: 1.2, peak: 0.05 * v, wet: 0.8 })
    tone(e, { freq: noteFreq(7), type: "sine", at: 0.06, attack: 0.03, dur: 1.1, peak: 0.035 * v, wet: 0.8 })
  },
  // «Clac» magnético: las piezas encajan en la S.
  snap: (e, v) => {
    tone(e, { freq: 190, to: 85, type: "sine", dur: 0.14, peak: 0.32 * v, glide: 0.1 })
    noise(e, { from: 1900, q: 2.2, dur: 0.045, peak: 0.18 * v })
    tone(e, { freq: noteFreq(10), type: "triangle", at: 0.012, attack: 0.008, dur: 0.5, peak: 0.05 * v, wet: 0.7 })
  },
  // Carta que cae sobre el mazo.
  card: (e, v) => {
    noise(e, { from: 1700 * vary(0.1), to: 650, q: 1.1, attack: 0.012, dur: 0.11, peak: 0.22 * v })
    tone(e, { freq: 150 * vary(0.05), to: 95, type: "sine", at: 0.07, dur: 0.09, peak: 0.16 * v, glide: 0.07 })
  },
  // Algo que sube y crece (el panel de la app).
  rise: (e, v) => {
    noise(e, { from: 300, to: 3400, q: 1, attack: 0.5, dur: 0.3, peak: 0.12 * v, wet: 0.45 })
    tone(e, { freq: noteFreq(0), to: noteFreq(5), type: "sine", attack: 0.45, dur: 0.4, peak: 0.06 * v, glide: 0.7, wet: 0.5 })
  },
  // Campana suave (cristal).
  chime: (e, v, { note = 5 }) => {
    const f = noteFreq(note) * vary(0.004)
    tone(e, { freq: f, type: "sine", attack: 0.004, dur: 1.1, peak: 0.11 * v, wet: 0.7 })
    tone(e, { freq: f * 2.01, type: "sine", attack: 0.004, dur: 0.6, peak: 0.035 * v, wet: 0.7 })
    tone(e, { freq: f * 3.98, type: "sine", attack: 0.002, dur: 0.25, peak: 0.012 * v, wet: 0.5 })
  },
  // Aviso de la app: dos notas.
  notify: (e, v, { note = 7 }) => {
    const a = noteFreq(note)
    const b = noteFreq(note + 2)
    tone(e, { freq: a, type: "sine", dur: 0.28, peak: 0.1 * v, wet: 0.5 })
    tone(e, { freq: b, type: "sine", at: 0.085, dur: 0.45, peak: 0.1 * v, wet: 0.55 })
    tone(e, { freq: b * 2, type: "sine", at: 0.085, dur: 0.15, peak: 0.02 * v })
  },
  // Relevo de proyecto: pasada corta de aire con un toque.
  swap: (e, v) => {
    noise(e, { from: 600, to: 2200, q: 0.8, attack: 0.1, dur: 0.22, peak: 0.12 * v, wet: 0.35 })
    tone(e, { freq: noteFreq(9), type: "triangle", at: 0.12, dur: 0.12, peak: 0.05 * v, wet: 0.4 })
  },
  // Confirmación al activar el sonido.
  toggle: (e, v) => {
    tone(e, { freq: noteFreq(5), type: "sine", dur: 0.18, peak: 0.12 * v, wet: 0.5 })
    tone(e, { freq: noteFreq(7), type: "sine", at: 0.07, dur: 0.22, peak: 0.12 * v, wet: 0.5 })
    tone(e, { freq: noteFreq(10), type: "sine", at: 0.14, dur: 0.6, peak: 0.1 * v, wet: 0.7 })
  },
}

/* ------------------------------------------------------------ Tocar */

export function playSound(name: SoundName, opts: PlayOptions = {}) {
  if (!enabled || !engine || engine.ctx.state !== "running") return
  if (typeof document !== "undefined" && document.visibilityState !== "visible") return
  const now = performance.now()
  if (now < quietUntil && name !== "toggle") return

  const last = lastPlayed.get(name) ?? -Infinity
  if (now - last < MIN_GAP[name]) return

  // Tope global: como mucho 5 sonidos cada 200 ms.
  recent = recent.filter((time) => now - time < 200)
  if (recent.length >= 5) return
  recent.push(now)
  lastPlayed.set(name, now)

  try {
    SOUNDS[name](engine, Math.max(0, opts.volume ?? 1), opts)
  } catch {
    /* un fallo de audio nunca rompe la página */
  }
}
