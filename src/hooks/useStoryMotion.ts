import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Options {
  root: RefObject<HTMLDivElement | null>
  started: boolean
  revealed: boolean
  reduced: boolean
  onChapter: (index: number) => void
}

type MotionKind = 'accent' | 'decor' | 'eyebrow' | 'fragments' | 'index' | 'lift' | 'line' | 'meta' | 'ornament' | 'soft' | 'thread' | 'words'

function createMotion(target: HTMLElement, kind: MotionKind, paused = true) {
  const timeline = gsap.timeline({ paused })
  const endOpacity = Number.parseFloat(window.getComputedStyle(target).opacity) || 1
  const fromTo = (targets: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, position = 0) =>
    timeline.fromTo(targets, fromVars, { ...toVars, immediateRender: false }, position)
  const addLine = (line: HTMLElement, position = 0) => {
    fromTo(line, { scaleX: 0, transformOrigin: 'left center' }, {
      scaleX: 1, duration: .65, ease: 'power3.out',
    }, position)
  }

  switch (kind) {
    case 'accent':
      fromTo(target, { y: 18, scale: .97, opacity: endOpacity * .4 }, {
        y: 0, scale: 1, opacity: endOpacity, duration: .9, ease: 'power3.out',
      })
      break
    case 'decor':
      fromTo(target, { y: 10, scale: .98 }, {
        y: 0, scale: 1, duration: 1, ease: 'power3.out',
      })
      break
    case 'eyebrow': {
      fromTo(target, { y: 12, opacity: 0 }, {
        y: 0, opacity: 1, duration: .6, ease: 'power3.out',
      })
      const rule = target.querySelector<HTMLElement>('.eyebrow-rule')
      if (rule) addLine(rule)
      break
    }
    case 'fragments': {
      fromTo(target, { y: 14, scale: .985, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, duration: .72, ease: 'power3.out',
      })
      const rows = target.querySelectorAll<HTMLElement>('.fragment-slot')
      if (rows.length) fromTo(rows, { y: 12, opacity: 0 }, {
        y: 0, opacity: 1, duration: .46, stagger: .1, ease: 'power3.out',
      }, .04)
      break
    }
    case 'index': {
      fromTo(target, { y: 9, opacity: 0 }, {
        y: 0, opacity: 1, duration: .55, ease: 'power3.out',
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
      fromTo(target, { y: 8, opacity: Math.min(endOpacity, .55) }, {
        y: 0, opacity: endOpacity, duration: .6, ease: 'power3.out',
      })
      const divider = target.querySelector<HTMLElement>('.journey-meta-divider')
      if (divider) addLine(divider)
      break
    }
    case 'ornament':
      fromTo(target, { y: 7, scale: .94, opacity: Math.min(endOpacity, .3) }, {
        y: 0, scale: 1, opacity: endOpacity, duration: .85, ease: 'power3.out',
      })
      break
    case 'soft':
      fromTo(target, { y: 12, opacity: Math.min(endOpacity, .5) }, {
        y: 0, opacity: endOpacity, duration: .65, ease: 'power3.out',
      })
      if (target.classList.contains('scroll-cue')) {
        const cueLine = target.querySelector<HTMLElement>('.scroll-cue-line')
        if (cueLine) timeline.fromTo(cueLine, { scaleY: 0, transformOrigin: 'center top' }, {
          scaleY: 1, duration: .5, ease: 'power3.out', immediateRender: false,
        }, .08)
      }
      break
    case 'thread':
      fromTo(target, { scaleY: 0, transformOrigin: 'top center', opacity: 0 }, {
        scaleY: 1, opacity: endOpacity, duration: 1.15, ease: 'power2.out',
      })
      break
    case 'words': {
      const words = target.querySelectorAll<HTMLElement>('.motion-word')
      if (words.length) fromTo(words, { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: .65, stagger: .035, ease: 'power3.out',
      })
      else fromTo(target, { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: .65, ease: 'power3.out',
      })
      break
    }
    case 'lift':
      fromTo(target, { y: 16, opacity: 0 }, {
        y: 0, opacity: 1, duration: .65, ease: 'power3.out',
      })
      break
  }

  return timeline
}

function attachScrollMotion(target: HTMLElement, kind: MotionKind) {
  const alreadyInView = target.getBoundingClientRect().top < window.innerHeight * .88
  const animation = createMotion(target, kind)
  ScrollTrigger.create({
    trigger: target,
    start: 'top 88%',
    animation,
    toggleActions: 'play none none reverse',
  })
  // Content initially in the viewport stays readable, but can reverse after crossing the trigger upward.
  if (alreadyInView) animation.progress(1).pause()
}

export function useStoryMotion({ root, started, revealed, reduced, onChapter }: Options) {
  const previousReveal = useRef(false)
  const previousStarted = useRef(false)
  useLayoutEffect(() => {
    if (!root.current) return
    const viewJustStarted = started && !previousStarted.current
    previousStarted.current = started
    gsap.registerPlugin(ScrollTrigger)
    const element = root.current
    const context = gsap.context(() => {
      const header = element.querySelector<HTMLElement>('.site-header')
      if (!started) {
        if (!reduced) {
          const intro = gsap.timeline()
          if (header) intro.fromTo(header, { y: -9, opacity: .58, immediateRender: false }, {
            y: 0, opacity: 1, duration: .62, ease: 'power3.out',
          }, 0)
          const targets = gsap.utils.toArray<HTMLElement>('.hero-stage [data-motion]', element)
          targets.forEach((target, index) => {
            const kind = target.dataset.motion as MotionKind
            intro.add(createMotion(target, kind, false), Math.max(0, index * .065))
          })
        }
        gsap.set('.orbit', { xPercent: 22, yPercent: -3, rotation: -25, scale: 1 })
        return
      }

      if (!reduced && viewJustStarted) {
        if (header) gsap.fromTo(header, { y: -9, opacity: .58, immediateRender: false }, {
          y: 0, opacity: 1, duration: .62, ease: 'power3.out',
        })
        gsap.fromTo('.reading-rail', { x: 10, opacity: .58, immediateRender: false }, {
          x: 0, opacity: 1, duration: .68, ease: 'power3.out',
        })
        const thread = element.querySelector<HTMLElement>('.story-thread')
        if (thread) createMotion(thread, 'thread').play(0)
      }

      const sections = gsap.utils.toArray<HTMLElement>('[data-story-section]', element)
      for (const section of sections) {
        ScrollTrigger.create({
          trigger: section, start: 'top 55%', end: 'bottom 55%',
          onEnter: () => onChapter(Number(section.dataset.chapter)),
          onEnterBack: () => onChapter(Number(section.dataset.chapter)),
        })
        if (reduced) continue

        const targets = section.querySelectorAll<HTMLElement>('[data-motion]')
        for (const target of targets) {
          // The confession line has its own word-level reveal so it can reverse independently.
          if (target.classList.contains('scene-heading') && target.querySelector('.confession-word')) continue
          attachScrollMotion(target, target.dataset.motion as MotionKind)
        }
      }
      gsap.set('.orbit', { xPercent: 0, yPercent: 0, rotation: 20, scale: .95 })
    }, element)
    // The newly unlocked ending changes page length; refresh all scroll positions.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { cancelAnimationFrame(frame); context.revert() }
  }, [root, started, revealed, reduced, onChapter])

  useLayoutEffect(() => {
    const freshlyRevealed = revealed && !previousReveal.current
    previousReveal.current = revealed
    if (!started || !revealed || !root.current) return
    if (freshlyRevealed) root.current.querySelector<HTMLElement>('.confession-actions .text-link')?.focus({ preventScroll: true })
    if (reduced) return
    const statement = root.current.querySelector<HTMLElement>('.confession-line')
    if (!statement) return
    const context = gsap.context(() => {
      const animation = gsap.fromTo('.confession-word', { opacity: 0, y: 42, rotationX: -15, immediateRender: false }, {
        opacity: 1, y: 0, rotationX: 0, stagger: 0.15, duration: 1.1, ease: 'power3.out', paused: true,
      })
      ScrollTrigger.create({
        trigger: statement,
        start: 'top 88%',
        animation,
        toggleActions: 'play none none reverse',
      })
      if (freshlyRevealed) animation.play(0)
      else if (statement.getBoundingClientRect().top < window.innerHeight * .88) animation.progress(1).pause()
    }, root)
    return () => context.revert()
  }, [root, revealed, reduced, started])
}
