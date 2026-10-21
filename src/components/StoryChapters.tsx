import type { Scene } from '../content/story'
import { storyConfig } from '../content/story'
import type { JourneyState } from '../lib/journey'
import { visibleChapters } from '../lib/journey'
import { Arrow } from './Arrow'
import { SceneContent } from './SceneContent'
import { SectionDecor } from './SectionDecor'

interface Props {
  scenes: Scene[]
  state: JourneyState
  onReveal: () => void
  onRestart: () => void
  transitioning: boolean
}

export function StoryChapters({ scenes, state, onReveal, onRestart, transitioning }: Props) {
  const chapters = visibleChapters(scenes, state)
  return <main className="scroll-story" id="story" aria-label="A few honest words">
    <h1 className="sr-only">A few honest words</h1>
    <div className="story-thread" data-motion="thread" aria-hidden="true" />
    {chapters.map((scene, index) => {
      const next = chapters[index + 1]
      const layout = scene.type === 'narrative' ? scene.layout : scene.type
      const pageNumber = scenes.findIndex((item) => item.id === scene.id) + 1
      return <section key={scene.id} id={`chapter-${scene.id}`} className={`story-section section-${layout}`}
        data-story-section data-chapter={index + 1} data-label={scene.label} aria-labelledby={`heading-${scene.id}`}>
        <SectionDecor scene={scene} index={index + 1} />
        <span className="chapter-numeral" data-motion="parallax" aria-hidden="true">{String(pageNumber).padStart(2, '0')}</span>
        <div className="section-inner">
          <div className="chapter-index" data-motion="index" aria-hidden="true">
            <span className="chapter-index-label">Ranfession · page</span>
            <span className="chapter-index-count">{String(pageNumber).padStart(2, '0')} <i /> {String(scenes.length).padStart(2, '0')}</span>
            <span className="chapter-index-divider" aria-hidden="true" />
          </div>
          <SceneContent scene={scene} headingTag="h2" headingId={`heading-${scene.id}`}
            revealed={scene.type === 'narrative' ? scene.fragments.length : scene.type === 'confession' && state.confessionRevealed ? 1 : 0}>
            {scene.type === 'confession' && <div className="section-actions confession-actions" data-motion="soft">
              {!state.confessionRevealed ? <>
                <button className="primary-button final-button" type="button" onClick={onReveal}>
                  <span>{scene.revealLabel ?? storyConfig.labels.reveal}</span><Arrow />
                </button>
                <p className="action-note">One honest click, when you're ready.</p>
              </> : next && <a className="text-link" href={`#chapter-${next.id}`}>One last page<Arrow down /></a>}
            </div>}
            {scene.type === 'closing' && <div className="section-actions" data-motion="soft">
              <button className="primary-button" type="button" disabled={transitioning} onClick={onRestart}>
                <span>{storyConfig.labels.replay}</span><Arrow />
              </button>
              <p className="action-note">A few honest words. Nothing owed.</p>
            </div>}
          </SceneContent>
        </div>
        {scene.type === 'narrative' && next && <a className="scroll-cue" data-motion="soft" href={`#chapter-${next.id}`}>
          <span>{index === 0 ? 'Scroll to let it unfold' : 'A little further'}</span><span className="scroll-cue-line" aria-hidden="true" />
        </a>}
        <span className="section-divider" data-motion="line" aria-hidden="true" />
      </section>
    })}
  </main>
}
