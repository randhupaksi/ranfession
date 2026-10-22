import { useCallback, useEffect, useRef, useState } from 'react'

type AudioStatus = 'muted' | 'starting' | 'playing' | 'unavailable'
interface AmbientGraph {
  context: AudioContext
  master: GainNode
  sources: AudioScheduledSourceNode[]
}

function createGraph(): AmbientGraph {
  const context = new AudioContext()
  try {
    const master = context.createGain()
    master.gain.value = 0
    master.connect(context.destination)
    const sources: AudioScheduledSourceNode[] = []
    // A long, filtered procedural air texture. No media download or short melody loop.
    const buffer = context.createBuffer(1, context.sampleRate * 7, context.sampleRate)
    const data = buffer.getChannelData(0)
    let smooth = 0
    for (let i = 0; i < data.length; i++) {
      smooth = (smooth + (Math.random() * 2 - 1) * 0.025) / 1.025
      const envelope = Math.min(
        1,
        i / (context.sampleRate * 0.2),
        (data.length - 1 - i) / (context.sampleRate * 0.2),
      )
      data[i] = smooth * 3 * envelope
    }
    const air = context.createBufferSource()
    air.buffer = buffer
    air.loop = true
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 720
    const airGain = context.createGain()
    airGain.gain.value = 0.17
    air.connect(filter).connect(airGain).connect(master)
    sources.push(air)
    for (const frequency of [110, 164.81, 220.12]) {
      const oscillator = context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      const gain = context.createGain()
      gain.gain.value = frequency === 110 ? 0.035 : 0.012
      oscillator.connect(gain).connect(master)
      sources.push(oscillator)
    }
    const lfo = context.createOscillator()
    lfo.frequency.value = 0.065
    const depth = context.createGain()
    depth.gain.value = 0.025
    lfo.connect(depth).connect(airGain.gain)
    sources.push(lfo)
    for (const source of sources) source.start()
    return { context, master, sources }
  } catch (error) {
    void context.close().catch(() => {})
    throw error
  }
}

export function useAmbience() {
  const graph = useRef<AmbientGraph | null>(null)
  const wanted = useRef(false)
  const starting = useRef(false)
  const mounted = useRef(true)
  const fadeTimer = useRef<number | undefined>(undefined)
  const volumeRef = useRef(0.35)
  const [status, setStatus] = useState<AudioStatus>('muted')
  const [volume, setVolume] = useState(0.35)
  const dispose = useCallback(() => {
    const current = graph.current
    graph.current = null
    if (!current) return
    for (const source of current.sources) source.stop()
    void current.context.close().catch(() => {})
  }, [])
  const applyGain = useCallback((on: boolean) => {
    const current = graph.current
    if (!current || current.context.state === 'closed') return
    const now = current.context.currentTime
    if (typeof current.master.gain.cancelAndHoldAtTime === 'function')
      current.master.gain.cancelAndHoldAtTime(now)
    else current.master.gain.cancelScheduledValues(now)
    current.master.gain.setTargetAtTime(on ? volumeRef.current : 0, now, 0.1)
  }, [])
  const toggle = useCallback(async () => {
    if (starting.current || status === 'unavailable') return
    wanted.current = !wanted.current
    window.clearTimeout(fadeTimer.current)
    if (!wanted.current) {
      applyGain(false)
      setStatus('muted')
      fadeTimer.current = window.setTimeout(() => {
        if (!wanted.current && graph.current?.context.state === 'running')
          void graph.current.context.suspend().catch(() => {})
      }, 650)
      return
    }
    starting.current = true
    setStatus('starting')
    try {
      if (!('AudioContext' in window)) throw new Error('Unsupported')
      graph.current ??= createGraph()
      let timeout: number | undefined
      try {
        await Promise.race([
          graph.current.context.resume(),
          new Promise<never>((_, reject) => {
            timeout = window.setTimeout(() => reject(new Error('Unavailable')), 2500)
          }),
        ])
      } finally {
        window.clearTimeout(timeout)
      }
      if (!mounted.current) return
      if (!wanted.current || graph.current.context.state !== 'running')
        throw new Error('Unavailable')
      applyGain(true)
      setStatus('playing')
    } catch {
      wanted.current = false
      dispose()
      if (mounted.current) setStatus('unavailable')
    } finally {
      starting.current = false
    }
  }, [applyGain, dispose, status])
  const changeVolume = (value: number) => {
    volumeRef.current = value
    setVolume(value)
    applyGain(wanted.current)
  }
  useEffect(() => {
    mounted.current = true
    const visibility = async () => {
      const current = graph.current
      if (!current) return
      try {
        if (document.hidden) await current.context.suspend()
        else if (wanted.current) {
          await current.context.resume()
          if (current.context.state !== 'running') throw new Error('Unavailable')
          applyGain(true)
        }
      } catch {
        wanted.current = false
        dispose()
        if (mounted.current) setStatus('unavailable')
      }
    }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      mounted.current = false
      wanted.current = false
      window.clearTimeout(fadeTimer.current)
      document.removeEventListener('visibilitychange', visibility)
      dispose()
    }
  }, [applyGain, dispose])
  return { status, volume, changeVolume, toggle }
}
