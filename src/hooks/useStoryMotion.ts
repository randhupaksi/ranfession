import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storyConfig } from '../content/story'

interface Options {
  root: RefObject<HTMLDivElement | null>
  started: boolean
  revealed: boolean
  reduced: boolean
  onChapter: (index: number) => void
}

type MotionKind = 'decor' | 'eyebrow' | 'fragments' | 'index' | 'lift' | 'line' | 'meta' | 'ornament' | 'parallax' | 'soft' | 'thread' | 'words'
type PendingTrigger = { target: HTMLElement; animation: gsap.core.Animation }
type DirectionalMotion = PendingTrigger & { playAt: number; reverseAt: number }
type DirectionalMotionController = { add: (motions: PendingTrigger[]) => void }

function createMotion(target: HTMLElement, kind: MotionKind, paused = true, measuredOpacity?: number) {
  const timeline = gsap.timeline({ paused })
  const endOpacity = measuredOpacity ?? (Number.parseFloat(window.getComputedStyle(target).opacity) || 1)
  const fromTo = (targets: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, position = 0) =>
    timeline.fromTo(targets, fromVars, toVars, position)
  const addLine = (line: HTMLElement, position = 0, duration = .8) => {
    fromTo(line, { scaleX: 0, transformOrigin: 'left center' }, {
      scaleX: 1, duration, ease: 'power1.out',
    }, position)
  }

  switch (kind) {
    case 'decor':
      if (target.closest('.hero-stage')) {
        fromTo(target, { opacity: 0, scale: .92, rotation: -5 }, {
          opacity: .7, scale: 1, rotation: 0, duration: 1.2, delay: .18, ease: 'power1.out',
        })
      } else {
        fromTo(target, { y: 18, scale: .92, rotation: -4, opacity: 0 }, {
          y: 0, scale: 1, rotation: 0, opacity: endOpacity, duration: 1.1, ease: 'power1.out',
        })
      }
      break
    case 'eyebrow': {
      fromTo(target, { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, ease: 'power1.out',
      })
      const rule = target.querySelector<HTMLElement>('.eyebrow-rule')
      if (rule) addLine(rule, target.closest('.hero-stage') ? .1 : 0, .8)
      break
    }
    case 'fragments': {
      fromTo(target, { y: 22, scale: .97, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, duration: .9, ease: 'power1.out',
      })
      const rows = target.querySelectorAll<HTMLElement>('.fragment-slot')
      if (rows.length) fromTo(rows, { y: 18, opacity: 0, rotation: (index) => index % 2 ? 1.2 : -1.2 }, {
        y: 0, opacity: 1, rotation: 0, duration: .92, stagger: .12, ease: 'power1.out',
      }, .04)
      break
    }
    case 'index': {
      fromTo(target, { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, ease: 'power1.out',
      })
      const divider = target.querySelector<HTMLElement>('.chapter-index-divider')
      if (divider) addLine(divider)
      const smallRule = target.querySelector<HTMLElement>('.chapter-index-count i')
      if (smallRule) addLine(smallRule, .08)
      break
    }
    case 'line':
      addLine(target)
      break
    case 'meta': {
      const isHero = Boolean(target.closest('.hero-stage'))
      fromTo(target, { y: 18, opacity: isHero ? Math.min(endOpacity, .55) : 0 }, {
        y: 0, opacity: endOpacity, duration: .9, ease: 'power1.out',
      })
      const divider = target.querySelector<HTMLElement>('.journey-meta-divider')
      if (divider) addLine(divider)
      break
    }
    case 'ornament':
      fromTo(target, { y: 18, scale: .92, rotation: -4, opacity: 0 }, {
        y: 0, scale: 1, rotation: 0, opacity: endOpacity, duration: 1.1, ease: 'power1.out',
      })
      break
    case 'soft': {
      const isHero = Boolean(target.closest('.hero-stage'))
      fromTo(target, { y: 18, opacity: isHero ? Math.min(endOpacity, .55) : 0 }, {
        y: 0, opacity: endOpacity, duration: .9, ease: 'power1.out',
      })
      if (target.classList.contains('scroll-cue')) {
        const cueLine = target.querySelector<HTMLElement>('.scroll-cue-line')
        if (cueLine) timeline.fromTo(cueLine, { scaleY: 0, transformOrigin: 'center top' }, {
          scaleY: 1, duration: .8, ease: 'power1.out',
        }, .08)
      }
      break
    }
    case 'thread':
      fromTo(target, { scaleY: 0, transformOrigin: 'top center', opacity: 0 }, {
        scaleY: 1, opacity: endOpacity, duration: 1.15, ease: 'power1.out',
      })
      break
    case 'words': {
      const words = target.querySelectorAll<HTMLElement>('.motion-word')
      const isHero = Boolean(target.closest('.hero-stage'))
      if (words.length && isHero) fromTo(words, { y: 54, opacity: 0, rotation: 2.5 }, {
        y: 0, opacity: 1, rotation: 0, duration: 1.1, stagger: .05, ease: 'power1.out',
      })
      else if (words.length) fromTo(words, {
        y: 42, opacity: 0,
        rotation: (index) => index % 2 ? -1.2 : 1.2,
      }, {
        y: 0, opacity: 1, rotation: 0, duration: 1.05, stagger: .045, ease: 'power1.out',
      }, .025)
      else fromTo(target, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.05, ease: 'power1.out',
      })
      break
    }
    case 'lift':
      fromTo(target, { y: 18, opacity: 0 }, {
        y: 0, opacity: endOpacity, duration: .9, ease: 'power1.out',
      })
      break
  }

  return timeline
}

function getLayoutTop(target: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = target
  while (current && current !== document.body) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return top
}

function createDirectionalMotionController(scrollRoot: HTMLElement, pending: PendingTrigger[]): DirectionalMotionController {
  const motions: DirectionalMotion[] = pending.map((motion) => ({ ...motion, playAt: 0, reverseAt: 0 }))
  let playOrder: DirectionalMotion[] = []
  let reverseOrder: DirectionalMotion[] = []
  let previousScroll = window.scrollY

  const synchronize = (scrollPosition: number) => {
    for (const motion of motions) {
      const progress = motion.animation.progress()
      if (scrollPosition >= motion.playAt && progress === 0) motion.animation.play()
      else if (scrollPosition <= motion.reverseAt && progress === 1) motion.animation.reverse()
    }
  }

  const measure = (scrollPosition?: number) => {
    for (const motion of motions) {
      const top = getLayoutTop(motion.target)
      motion.playAt = top - window.innerHeight * .88
      motion.reverseAt = top - window.innerHeight * .96
    }
    playOrder = [...motions].sort((a, b) => a.playAt - b.playAt)
    reverseOrder = [...motions].sort((a, b) => a.reverseAt - b.reverseAt)
    if (scrollPosition !== undefined) synchronize(scrollPosition)
  }

  const firstAfter = (items: DirectionalMotion[], key: 'playAt' | 'reverseAt', value: number) => {
    let low = 0
    let high = items.length
    while (low < high) {
      const middle = (low + high) >>> 1
      if (items[middle][key] <= value) low = middle + 1
      else high = middle
    }
    return low
  }

  const firstAtOrAfter = (items: DirectionalMotion[], key: 'playAt' | 'reverseAt', value: number) => {
    let low = 0
    let high = items.length
    while (low < high) {
      const middle = (low + high) >>> 1
      if (items[middle][key] < value) low = middle + 1
      else high = middle
    }
    return low
  }

  const handleScroll = (currentScroll: number) => {
    if (currentScroll > previousScroll) {
      let index = firstAfter(playOrder, 'playAt', previousScroll)
      while (index < playOrder.length && playOrder[index].playAt <= currentScroll) {
        playOrder[index].animation.play()
        index += 1
      }
    } else if (currentScroll < previousScroll) {
      let index = firstAtOrAfter(reverseOrder, 'reverseAt', currentScroll)
      while (index < reverseOrder.length && reverseOrder[index].reverseAt < previousScroll) {
        reverseOrder[index].animation.reverse()
        index += 1
      }
    }
    previousScroll = currentScroll
  }

  ScrollTrigger.create({
    trigger: scrollRoot,
    start: 'top top',
    end: 'bottom bottom',
    onRefresh: (self) => {
      measure(self.scroll())
      previousScroll = self.scroll()
    },
    onUpdate: (self) => handleScroll(self.scroll()),
  })
  measure(window.scrollY)
  previousScroll = window.scrollY

  return {
    add: (newMotions) => {
      motions.push(...newMotions.map((motion) => ({ ...motion, playAt: 0, reverseAt: 0 })))
      measure(window.scrollY)
      previousScroll = window.scrollY
    },
  }
}

function attachScrollMotion(
  target: HTMLElement,
  kind: MotionKind,
  pendingTriggers: PendingTrigger[],
  enterImmediately = false,
  measuredBounds?: DOMRect,
  measuredOpacity?: number,
) {
  if (kind === 'parallax') {
    const section = target.closest<HTMLElement>('[data-story-section]')
    if (!section) return
    gsap.fromTo(target, { y: 55 }, {
      y: -65, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: .8 },
    })
    return
  }

  const bounds = measuredBounds ?? target.getBoundingClientRect()
  const inViewport = bounds.bottom > 0 && bounds.top < window.innerHeight
  const alreadyAboveViewport = bounds.bottom <= 0
  const animation = createMotion(target, kind, true, measuredOpacity)
  const shouldEnterNow = enterImmediately && inViewport
  if (alreadyAboveViewport || (inViewport && !shouldEnterNow)) animation.progress(1).pause()
  else animation.progress(0).pause()
  pendingTriggers.push({ target, animation })
  if (shouldEnterNow) animation.play(0)
}

function attachSectionMotion(
  section: HTMLElement,
  reduced: boolean,
  onChapter: (index: number) => void,
  pendingTriggers: PendingTrigger[],
  enterVisibleTargets = false,
  measuredBounds?: Map<HTMLElement, DOMRect>,
  measuredOpacities?: Map<HTMLElement, number>,
) {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 55%',
    onEnter: () => onChapter(Number(section.dataset.chapter)),
    onEnterBack: () => onChapter(Number(section.dataset.chapter)),
  })
  if (reduced) return

  const targets = section.querySelectorAll<HTMLElement>('[data-motion]')
  for (const target of targets) {
    // The confession line gets its own word-level reveal after Final Click.
    if (target.classList.contains('scene-heading') && section.classList.contains('section-confession')) continue
    attachScrollMotion(
      target,
      target.dataset.motion as MotionKind,
      pendingTriggers,
      enterVisibleTargets,
      measuredBounds?.get(target),
      measuredOpacities?.get(target),
    )
  }
}

export function useStoryMotion({ root, started, revealed, reduced, onChapter }: Options) {
  const previousReveal = useRef(false)
  const previousStarted = useRef(false)
  const directionalController = useRef<DirectionalMotionController | null>(null)
  useLayoutEffect(() => {
    if (!root.current) return
    const viewJustStarted = started && !previousStarted.current
    previousStarted.current = started
    gsap.registerPlugin(ScrollTrigger)
    const element = root.current
    const sections = started
      ? gsap.utils.toArray<HTMLElement>('[data-story-section]', element)
      : []
    const measuredBounds = new Map<HTMLElement, DOMRect>()
    const measuredOpacities = new Map<HTMLElement, number>()
    if (!reduced) {
      // Read geometry and computed styles before GSAP applies entrance transforms,
      // avoiding repeated read/write layout and style flushes during trigger setup.
      sections.forEach((section) => {
        section.querySelectorAll<HTMLElement>('[data-motion]').forEach((target) => {
          if (target.dataset.motion !== 'parallax'
            && !(target.classList.contains('scene-heading') && section.classList.contains('section-confession'))) {
            measuredBounds.set(target, target.getBoundingClientRect())
            measuredOpacities.set(target, Number.parseFloat(window.getComputedStyle(target).opacity) || 1)
          }
        })
      })
    }
    const context = gsap.context(() => {
      const header = element.querySelector<HTMLElement>('.site-header')
      if (!started) {
        if (!reduced) {
          const intro = gsap.timeline()
          if (header) intro.fromTo(header, { y: -9, opacity: .58 }, {
            y: 0, opacity: 1, duration: .62, ease: 'power1.out',
          }, 0)
          const targets = gsap.utils.toArray<HTMLElement>('.hero-stage [data-motion]', element)
          targets.forEach((target, index) => {
            const kind = target.dataset.motion as MotionKind
            const position = kind === 'words' ? 0
              : kind === 'eyebrow' ? 0
                : kind === 'decor' ? 0
                  : Math.max(.12, index * .07)
            intro.add(createMotion(target, kind, false), position)
          })
        }
        gsap.set('.orbit', { xPercent: 22, yPercent: -3, rotation: -25, scale: 1 })
        return
      }

      if (!reduced && viewJustStarted) {
        if (header) gsap.fromTo(header, { y: -9, opacity: .58 }, {
          y: 0, opacity: 1, duration: .62, ease: 'power1.out',
        })
        gsap.fromTo('.reading-rail', { x: 10, opacity: .58 }, {
          x: 0, opacity: 1, duration: .68, ease: 'power1.out',
        })
        const thread = element.querySelector<HTMLElement>('.story-thread')
        if (thread) createMotion(thread, 'thread').play(0)
      }

      const pendingTriggers: PendingTrigger[] = []
      sections.forEach((section, index) => attachSectionMotion(
        section,
        reduced,
        onChapter,
        pendingTriggers,
        viewJustStarted && index === 0,
        measuredBounds,
        measuredOpacities,
      ))
      const scrollRoot = element.querySelector<HTMLElement>('.scroll-story')
      if (!reduced && scrollRoot && pendingTriggers.length) {
        directionalController.current = createDirectionalMotionController(scrollRoot, pendingTriggers)
      }
      if (storyConfig.visuals.orbitalAccent && !reduced) {
        const orbit = gsap.timeline({ scrollTrigger: { trigger: '.scroll-story', start: 'top top', end: 'bottom bottom', scrub: 1.1 } })
        orbit.fromTo('.orbit', { xPercent: 25, yPercent: -3, rotation: -20, scale: 1 }, {
          xPercent: -22, yPercent: 5, rotation: 110, scale: .9, duration: 2, ease: 'none',
        }).to('.orbit', { xPercent: 0, yPercent: 0, rotation: 290, scale: 1.06, duration: 3, ease: 'none' })
      } else {
        gsap.set('.orbit', { xPercent: 0, yPercent: 0, rotation: 20, scale: .95 })
      }
    }, element)
    return () => {
      directionalController.current = null
      context.revert()
    }
  }, [root, started, reduced, onChapter])

  useLayoutEffect(() => {
    const freshlyRevealed = revealed && !previousReveal.current
    previousReveal.current = revealed
    if (!started || !revealed || !root.current) return
    if (freshlyRevealed) root.current.querySelector<HTMLElement>('.confession-actions .text-link')?.focus({ preventScroll: true })
    const dynamicContext = gsap.context(() => {
      const sections = root.current?.querySelectorAll<HTMLElement>('[data-story-section]')
      const closingSection = sections?.[sections.length - 1]
      if (closingSection) {
        const pendingTriggers: PendingTrigger[] = []
        attachSectionMotion(closingSection, reduced, onChapter, pendingTriggers)
        directionalController.current?.add(pendingTriggers)
      }
    }, root)
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    if (reduced) return () => { cancelAnimationFrame(frame); dynamicContext.revert() }
    const statement = root.current.querySelector<HTMLElement>('.confession-line')
    if (!statement) return () => { cancelAnimationFrame(frame); dynamicContext.revert() }
    const confessionContext = gsap.context(() => {
      const animation = gsap.fromTo('.confession-word', { opacity: 0, y: 42 }, {
        opacity: 1, y: 0, stagger: .12, duration: 1.15, ease: 'power1.out', paused: true,
      })
      directionalController.current?.add([{ target: statement, animation }])
      if (freshlyRevealed) animation.play(0)
      else if (statement.getBoundingClientRect().top < window.innerHeight * .88) animation.progress(1).pause()
    }, root)
    return () => {
      cancelAnimationFrame(frame)
      dynamicContext.revert()
      confessionContext.revert()
    }
  }, [root, revealed, reduced, started, onChapter])
}
