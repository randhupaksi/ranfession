import type { Scene } from '../content/story'

export interface JourneyState { started: boolean; confessionRevealed: boolean }
export type JourneyAction = { type: 'begin' | 'opening' | 'reveal' | 'restart' }
export const initialJourney: JourneyState = { started: false, confessionRevealed: false }

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'begin': return { ...state, started: true }
    case 'opening': return { ...state, started: false }
    case 'reveal': return state.started ? { ...state, confessionRevealed: true } : state
    case 'restart': return initialJourney
  }
}

// Scroll can reach the confession, but the final click alone opens the last pages.
export function visibleChapters(scenes: Scene[], state: JourneyState): Scene[] {
  if (!state.started) return []
  const story = scenes.filter((scene) => scene.type !== 'invitation')
  if (state.confessionRevealed) return story
  const gate = story.findIndex((scene) => scene.type === 'confession')
  return gate < 0 ? story : story.slice(0, gate + 1)
}
