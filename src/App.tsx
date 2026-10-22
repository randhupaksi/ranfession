import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import gsap from 'gsap'
import { resolveScenes, storyConfig } from './content/story'
import { initialJourney, journeyReducer, visibleChapters } from './lib/journey'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useStoryMotion } from './hooks/useStoryMotion'
import { Orbit } from './components/Orbit'
import { SceneContent } from './components/SceneContent'
import { SoundControl } from './components/SoundControl'
import { Arrow } from './components/Arrow'
import { StoryChapters } from './components/StoryChapters'
import { SectionDecor } from './components/SectionDecor'
import './App.css'
import './scroll-story.css'

const { scenes } = resolveScenes(storyConfig.scenes)
const pad = (number: number) => String(number).padStart(2, '0')

export default function App() {
  const [journey, dispatch] = useReducer(journeyReducer, initialJourney)
  const [activeChapter, setActiveChapter] = useState(1)
  const [transitioning, setTransitioning] = useState(false)
  const [skipMotion, setSkipMotion] = useState(false)
  const systemReduced = useReducedMotion()
  const reduced = systemReduced || skipMotion
  const shellRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<gsap.core.Tween | null>(null)
  const busy = useRef(false)
  const chapters = visibleChapters(scenes, journey)
  const currentIndex = journey.started ? Math.min(activeChapter, scenes.length - 1) : 0
  const onChapter = useCallback((index: number) => setActiveChapter(index), [])

  useStoryMotion({
    root: shellRef,
    started: journey.started,
    revealed: journey.confessionRevealed,
    reduced,
    onChapter,
  })
  useEffect(() => {
    document.title = storyConfig.title
  }, [])
  useEffect(
    () => () => {
      transitionRef.current?.kill()
    },
    [],
  )

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (journey.started) {
      shellRef.current
        ?.querySelector<HTMLElement>('.scroll-story .scene-heading')
        ?.focus({ preventScroll: true })
    } else if (shellRef.current?.dataset.visited === 'true') {
      shellRef.current
        .querySelector<HTMLElement>('.hero-stage .scene-heading')
        ?.focus({ preventScroll: true })
    }
    if (shellRef.current && journey.started) shellRef.current.dataset.visited = 'true'
  }, [journey.started])

  const changeView = (type: 'begin' | 'opening' | 'restart') => {
    if (busy.current) return
    busy.current = true
    setTransitioning(true)
    const commit = () => {
      if (type === 'begin') setActiveChapter(1)
      dispatch({ type })
      busy.current = false
      setTransitioning(false)
    }
    if (reduced) {
      commit()
      return
    }
    transitionRef.current = gsap.to(
      shellRef.current?.querySelector(journey.started ? '.scroll-story' : '.hero-stage') ?? null,
      {
        opacity: 0,
        y: -14,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: commit,
      },
    )
  }

  const motionControl = !systemReduced && (
    <button
      className="motion-button"
      type="button"
      aria-pressed={skipMotion}
      onClick={() => setSkipMotion(!skipMotion)}
    >
      {skipMotion ? 'Enable motion' : 'Reduce motion'}
    </button>
  )

  return (
    <div
      ref={shellRef}
      className={`experience ${journey.started ? 'is-reading' : 'is-invitation'} ${journey.started && journey.confessionRevealed ? 'confession-revealed' : ''} ${storyConfig.visuals.orbitalAccent ? '' : 'without-orbit'} ${storyConfig.visuals.grain ? '' : 'without-grain'}`}
    >
      <a className="skip-link" href="#story">
        Skip to story
      </a>
      <Orbit />
      <header className="site-header">
        <button
          className="wordmark-button"
          type="button"
          aria-label="Return to opening"
          disabled={!journey.started || transitioning}
          onClick={() => changeView('opening')}
        >
          <span className="wordmark">
            ranfession<span aria-hidden="true">.</span>
          </span>
        </button>
        {journey.started && <span className="header-note">a story, quietly unfolding</span>}
        <SoundControl />
      </header>

      {!journey.started ? (
        <div className="hero-stage">
          <main className="chapter" id="story" aria-labelledby="scene-heading">
            <SectionDecor scene={scenes[0]} index={0} stage="hero" />
            <SceneContent scene={scenes[0]} revealed={0} />
          </main>
          <footer className="journey-footer">
            <span className="footer-star" data-motion="ornament" aria-hidden="true">
              ✶
            </span>
            <div className="journey-navigation" data-motion="soft">
              <span className="dedication">{storyConfig.dedication}</span>
              <button
                className="primary-button"
                type="button"
                disabled={transitioning}
                onClick={() => changeView('begin')}
              >
                <span>{scenes[0].continueLabel ?? storyConfig.labels.begin}</span>
                <Arrow />
              </button>
            </div>
            <div className="journey-meta" data-motion="meta">
              <span className="journey-meta-divider" aria-hidden="true" />
              <span className="chapter-progress" aria-label={`Chapter 1 of ${scenes.length}`}>
                <span className="progress-current">01</span>
                <span className="progress-separator">/</span>
                {pad(scenes.length)}
              </span>
              <span className="journey-caption">A little courage. Then let the story unfold.</span>
              {motionControl}
            </div>
          </footer>
        </div>
      ) : (
        <>
          <StoryChapters
            scenes={scenes}
            state={journey}
            onReveal={() => dispatch({ type: 'reveal' })}
            onRestart={() => changeView('restart')}
            transitioning={transitioning}
          />
          <aside className="reading-rail" aria-label="Story progress">
            <div
              className="reading-position"
              aria-label={`Chapter ${currentIndex + 1} of ${scenes.length}`}
            >
              <span>{pad(currentIndex + 1)}</span>
              <span className="rail-divider" />
              {pad(scenes.length)}
            </div>
            <nav className="chapter-dots" aria-label="Available chapters">
              {chapters.map((scene, index) => (
                <a
                  key={scene.id}
                  href={`#chapter-${scene.id}`}
                  aria-label={`${pad(index + 2)}: ${scene.label}`}
                  aria-current={currentIndex === index + 1 ? 'location' : undefined}
                >
                  <span />
                </a>
              ))}
            </nav>
            {motionControl}
          </aside>
        </>
      )}
    </div>
  )
}
