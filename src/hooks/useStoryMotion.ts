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

export function useStoryMotion({ root, started, revealed, reduced, onChapter }: Options) {
  const previousReveal = useRef(false)
  useLayoutEffect(() => {
    if (!root.current) return
    gsap.registerPlugin(ScrollTrigger)
    const element = root.current
    const context = gsap.context(() => {
      if (!started) {
        if (!reduced) {
          gsap.fromTo('.hero-stage .motion-word', { y: 54, opacity: 0, rotation: 2.5, filter: 'blur(3px)' }, {
            y: 0, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: .9, stagger: .045, ease: 'power3.out',
          })
          gsap.fromTo('.hero-stage .eyebrow-rule', { scaleX: 0, transformOrigin: 'left center' }, {
            scaleX: 1, duration: .8, delay: .1, ease: 'power3.out',
          })
          gsap.fromTo('.hero-stage .section-decor', { opacity: 0, scale: .92, rotation: -5 }, {
            opacity: .7, scale: 1, rotation: 0, duration: 1.2, delay: .18, ease: 'power3.out',
          })
          gsap.to('.hero-stage .decor-orbit-one', { rotation: 360, duration: 46, repeat: -1, ease: 'none' })
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

        // Text always exists in the document. Scroll adds motion without gating reading.
        const targets = section.querySelectorAll<HTMLElement>('.eyebrow-rule, .motion-word, .closing-star, .section-actions')
        for (const [targetIndex, target] of Array.from(targets).entries()) {
          if (target.dataset.entered === 'true') continue
          const isWord = target.classList.contains('motion-word')
          gsap.fromTo(target, { y: isWord ? 34 : 18, opacity: 0, rotation: isWord ? (targetIndex % 2 ? 1.8 : -1.8) : 0, filter: isWord ? 'blur(2px)' : 'none' }, {
            y: 0, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: isWord ? .72 : .9, delay: isWord ? Math.min(targetIndex * .018, .22) : 0, ease: 'power3.out',
            onStart: () => { target.dataset.entered = 'true' },
            scrollTrigger: { trigger: target, start: 'top 88%', toggleActions: 'play none none none', once: true },
          })
        }
        const decor = section.querySelector<HTMLElement>('.section-decor')
        if (decor && decor.dataset.entered !== 'true') {
          const targetOpacity = Number(getComputedStyle(decor).opacity) || .58
          gsap.fromTo(decor, { y: 18, scale: .92, rotation: -4, opacity: 0 }, {
            y: 0, scale: 1, rotation: 0, opacity: targetOpacity, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 84%', toggleActions: 'play none none none', once: true },
            onStart: () => { decor.dataset.entered = 'true' },
          })
        }
        const numeral = section.querySelector('.chapter-numeral')
        gsap.fromTo(numeral, { y: 55 }, {
          y: -65, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        })
      }

      if (storyConfig.visuals.orbitalAccent) {
        if (reduced) gsap.set('.orbit', { xPercent: 0, yPercent: 0, rotation: 20, scale: 0.95 })
        else {
          const orbit = gsap.timeline({ scrollTrigger: { trigger: '.scroll-story', start: 'top top', end: 'bottom bottom', scrub: 1.1 } })
          orbit.fromTo('.orbit', { xPercent: 25, yPercent: -3, rotation: -20, scale: 1 }, { xPercent: -22, yPercent: 5, rotation: 110, scale: 0.9, duration: 2, ease: 'none' })
            .to('.orbit', { xPercent: 0, yPercent: 0, rotation: 290, scale: 1.06, duration: 3, ease: 'none' })
          gsap.to('.scroll-story .decor-orbit-one', { rotation: 360, duration: 54, repeat: -1, ease: 'none' })
        }
      }
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
