import type { ReactNode, RefObject } from 'react'
import type { Scene } from '../content/story'
import { storyConfig } from '../content/story'

function motionWords(text: string) {
  const words = text.trim().split(/\s+/)
  return <span className="motion-copy" aria-hidden="true">
    {words.map((word, index) => <span className="motion-word" key={`${word}-${index}`}>{word}{index < words.length - 1 ? ' ' : ''}</span>)}
  </span>
}

interface Props {
  scene: Scene
  revealed: number
  headingRef?: RefObject<HTMLHeadingElement | null>
  headingTag?: 'h1' | 'h2'
  headingId?: string
  children?: ReactNode
}

export function SceneContent({ scene, revealed, headingRef, headingTag: Heading = 'h1', headingId = 'scene-heading', children }: Props) {
  const confessed = scene.type === 'confession' && revealed > 0
  const headingText = scene.emphasis ? `${scene.heading} ${scene.emphasis}` : scene.heading
  return <div className={`scene-content layout-${scene.type === 'narrative' ? scene.layout : scene.type} ${confessed ? 'is-confessed' : ''}`}>
    <div className="scene-eyebrow"><span className="eyebrow-rule" /><span>{scene.label}</span></div>
    {scene.type === 'invitation' && <p className="greeting">{storyConfig.recipientName.trim() ? `Hey, ${storyConfig.recipientName.trim()}.` : 'Hey, you.'}</p>}
    <Heading ref={headingRef} tabIndex={-1} className="scene-heading" id={headingId}>
      {confessed ? <><span className="sr-only">{scene.confession}</span><span className="confession-line" aria-hidden="true">{scene.confession.split(/\s+/).map((word, i) => <span className="confession-word" key={`${word}-${i}`}>{word}{i < scene.confession.split(/\s+/).length - 1 ? ' ' : ''}</span>)}</span></>
        : <><span className="sr-only">{headingText}</span><span className="heading-visual" aria-hidden="true"><span className="heading-line">{motionWords(scene.heading)}</span>{scene.emphasis && <em className="heading-line">{motionWords(scene.emphasis)}</em>}</span></>}
    </Heading>
    {scene.type === 'invitation' && <p className="scene-body opening-body">{scene.body}</p>}
    {scene.type === 'narrative' && <div className="fragments">
      {scene.fragments.map((fragment, index) => <div className={`fragment-slot ${index < revealed ? 'is-revealed' : ''}`} key={`${scene.id}-${index}`}>
        {index < revealed && <div className="fragment" data-reveal-index={index}>
          {scene.layout === 'fragments' && <span className="fragment-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
          <p>{fragment}</p>
        </div>}
      </div>)}
    </div>}
    {scene.type === 'confession' && <div className="confession-body" aria-live="polite" aria-atomic="true">
      {confessed && <span className="sr-only">{scene.confession}</span>}
      <p className="scene-body">{confessed ? scene.supporting : scene.introduction}</p>
    </div>}
    {scene.type === 'closing' && <div className="closing-body">
      <p className="scene-body">{scene.body}</p>
      <p className="signature">{storyConfig.senderName.trim() ? `With warmth, ${storyConfig.senderName.trim()}` : 'With a little more courage than before.'}</p>
      <span className="closing-star" aria-hidden="true">✧</span>
    </div>}
    {children}
  </div>
}
