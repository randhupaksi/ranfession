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

export function useStoryMotion({ root, started, revealed, reduced, onChapter }: Options) {
  const previousReveal = useRef(false)
  useLayoutEffect(() => {
    if (!root.current) return
    gsap.registerPlugin(ScrollTrigger)
    const element = root.current
    const context = gsap.context(() => {
      if (!started) {
        if (!reduced) {
          gsap.fromTo('.hero-stage .motion-word', { y: 30, opacity: 0 }, {
            y: 0, opacity: 1, duration: .75, stagger: .045, ease: 'power3.out',
          })
          gsap.fromTo('.hero-stage .eyebrow-rule', { scaleX: 0, transformOrigin: 'left center' }, {
            scaleX: 1, duration: .8, delay: .1, ease: 'power3.out',
          })
          gsap.fromTo('.hero-stage .section-decor', { opacity: 0, scale: .92, rotation: -5 }, {
            opacity: .7, scale: 1, rotation: 0, duration: 1.2, delay: .18, ease: 'power3.out',
          })
        }
        gsap.set('.orbit', { xPercent: 22, yPercent: -3, rotation: -25, scale: 1 })
        return
      }

      const sections = gsap.utils.toArray<HTMLElement>('[data-story-section]', element)
      for (const section of sections) {
        ScrollTrigger.create({
          trigger: section, start: 'top 55%', end: 'bottom 55%',
          onEnter: () => onChapter(Number(section.dataset.chapter)),
          onEnterBack: () => onChapter(Number(section.dataset.chapter)),
        })
        if (reduced) continue

        // One trigger per reading block, rather than one for every word.
        const targets = section.querySelectorAll<HTMLElement>('.scene-heading, .fragment, .closing-body')
        for (const target of targets) {
          if (target.dataset.entered === 'true') continue
          // Already visible content must not disappear when the motion settings change.
          if (target.getBoundingClientRect().top < window.innerHeight * .88) {
            target.dataset.entered = 'true'
            continue
          }
          const words = target.classList.contains('scene-heading') ? target.querySelectorAll('.motion-word') : []
          const animated = words.length ? words : target
          gsap.fromTo(animated, { y: 18, opacity: 0 }, {
            y: 0, opacity: 1, duration: .65, stagger: words.length ? .035 : 0, ease: 'power3.out',
            onStart: () => { target.dataset.entered = 'true' },
            scrollTrigger: { trigger: target, start: 'top 88%', toggleActions: 'play none none none', once: true },
          })
        }
      }
      gsap.set('.orbit', { xPercent: 0, yPercent: 0, rotation: 20, scale: .95 })
    }, element)
    // The newly unlocked ending changes the page length; refresh all scroll positions.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { cancelAnimationFrame(frame); context.revert() }
  }, [root, started, revealed, reduced, onChapter])

  useLayoutEffect(() => {
    const freshlyRevealed = revealed && !previousReveal.current
    previousReveal.current = revealed
    if (!started || !freshlyRevealed || !root.current) return
    root.current.querySelector<HTMLElement>('.confession-actions .text-link')?.focus({ preventScroll: true })
    if (reduced) return
    const context = gsap.context(() => {
      gsap.fromTo('.confession-word', { opacity: 0, y: 42, rotationX: -15 }, {
        opacity: 1, y: 0, rotationX: 0, stagger: 0.15, duration: 1.1, ease: 'power3.out',
      })
    }, root)
    return () => context.revert()
  }, [root, revealed, reduced, started])
}
