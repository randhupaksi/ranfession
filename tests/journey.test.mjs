import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, watch: null },
  appType: 'custom',
})
after(() => server.close())
const { storyConfig, resolveScenes } = await server.ssrLoadModule('/src/content/story.ts')
const { journeyReducer, initialJourney, visibleChapters } =
  await server.ssrLoadModule('/src/lib/journey.ts')
const { SceneContent } = await server.ssrLoadModule('/src/components/SceneContent.tsx')
const { StoryChapters } = await server.ssrLoadModule('/src/components/StoryChapters.tsx')
const { SoundControl } = await server.ssrLoadModule('/src/components/SoundControl.tsx')
const { default: App } = await server.ssrLoadModule('/src/App.tsx')
const configured = resolveScenes(storyConfig.scenes)
const { scenes } = resolveScenes([
  {
    id: 'opening',
    type: 'invitation',
    label: 'Opening',
    heading: 'A small note.',
    body: 'A few words to read.',
  },
  {
    id: 'first',
    type: 'narrative',
    layout: 'editorial',
    label: 'Beginning',
    heading: 'A beginning.',
    fragments: ['First line.', 'Second line.'],
  },
  {
    id: 'details',
    type: 'narrative',
    layout: 'fragments',
    label: 'Details',
    heading: 'Little details.',
    fragments: ['A small detail.', 'Another small detail.', 'One more detail.'],
  },
  {
    id: 'moments',
    type: 'narrative',
    layout: 'quotation',
    label: 'Moments',
    heading: 'A quiet moment.',
    fragments: ['One moment.', 'A second moment.'],
  },
  {
    id: 'realization',
    type: 'narrative',
    layout: 'realization',
    label: 'Realization',
    heading: 'Something changes.',
    fragments: ['A thought.', 'Another thought.'],
  },
  {
    id: 'unsaid',
    type: 'narrative',
    layout: 'quiet',
    label: 'Unsaid',
    heading: 'One last thought.',
    fragments: ['Something to say.'],
  },
  {
    id: 'confession',
    type: 'confession',
    label: 'Confession',
    heading: 'One honest sentence.',
    introduction: 'When you are ready.',
    confession: 'I like you.',
    supporting: 'A sincerely meant sentence.',
  },
  {
    id: 'closing',
    type: 'closing',
    label: 'Closing',
    heading: 'Thank you.',
    body: 'Nothing is owed.',
  },
])
const begun = journeyReducer(initialJourney, { type: 'begin' })
const revealed = journeyReducer(begun, { type: 'reveal' })
const render = (scene, count = 0) =>
  renderToStaticMarkup(createElement(SceneContent, { scene, revealed: count }))
const renderStory = state =>
  renderToStaticMarkup(
    createElement(StoryChapters, {
      scenes,
      state,
      onReveal() {},
      onRestart() {},
      transitioning: false,
    }),
  )

test('editable story validates without silently dropping content or using a fallback', () => {
  assert.equal(configured.scenes.length, storyConfig.scenes.length)
  assert.equal(configured.usedFallback, false)
  assert.equal(configured.scenes[0].type, 'invitation')
  assert.equal(configured.scenes.at(-1).type, 'closing')
})

test('the invitation keeps all scroll chapters unmounted until Begin', () => {
  assert.deepEqual(visibleChapters(scenes, initialJourney), [])
  assert.equal(begun.started, true)
  assert.equal(begun.confessionRevealed, false)
})

test('Begin makes narrative chapters available together, with confession as the scroll boundary', () => {
  const chapters = visibleChapters(scenes, begun)
  assert.equal(chapters[0].id, 'first')
  assert.equal(chapters.at(-1).type, 'confession')
  assert.ok(!chapters.some(scene => scene.type === 'closing'))
  assert.equal(chapters.filter(scene => scene.type === 'narrative').length, 5)
})

test('reveal requires entering the story and repeated clicks do not advance or reset it', () => {
  assert.deepEqual(journeyReducer(initialJourney, { type: 'reveal' }), initialJourney)
  assert.equal(revealed.confessionRevealed, true)
  assert.deepEqual(journeyReducer(revealed, { type: 'reveal' }), revealed)
  assert.equal(visibleChapters(scenes, revealed).at(-1).type, 'closing')
})

test('returning to the opening preserves the reveal; replay resets the whole journey', () => {
  const opening = journeyReducer(revealed, { type: 'opening' })
  assert.equal(opening.started, false)
  assert.equal(opening.confessionRevealed, true)
  assert.deepEqual(visibleChapters(scenes, opening), [])
  assert.equal(journeyReducer(opening, { type: 'begin' }).confessionRevealed, true)
  assert.deepEqual(journeyReducer(revealed, { type: 'restart' }), initialJourney)
})

test('scene additions, deletion, reordering, and moved confession preserve the correct scroll gate', () => {
  const changed = [...scenes]
  changed.splice(1, 1)
  changed.splice(2, 0, {
    id: 'new-note',
    type: 'narrative',
    layout: 'fragments',
    label: 'Another note',
    heading: 'Three things.',
    fragments: ['First.', 'Second.', 'Third.'],
  })
  const confession = changed.splice(
    changed.findIndex(scene => scene.type === 'confession'),
    1,
  )[0]
  changed.splice(3, 0, confession)
  ;[changed[1], changed[2]] = [changed[2], changed[1]]
  const result = resolveScenes(changed)
  assert.equal(result.usedFallback, false)
  assert.equal(visibleChapters(result.scenes, begun).length, 3)
  assert.equal(visibleChapters(result.scenes, begun).at(-1).id, confession.id)
  assert.equal(visibleChapters(result.scenes, revealed).length, result.scenes.length - 1)
})

test('invalid optional scenes and duplicate IDs are skipped safely', () => {
  const result = resolveScenes([
    scenes[0],
    { ...scenes[1], heading: '' },
    scenes[2],
    scenes[2],
    ...scenes.slice(3),
  ])
  assert.equal(result.usedFallback, true)
  assert.equal(result.scenes.length, 7)
  assert.equal(new Set(result.scenes.map(scene => scene.id)).size, 7)
})

test('broken essentials and empty configuration use a complete safe fallback', () => {
  for (const input of [
    null,
    [],
    [{ type: 'unknown' }],
    scenes.filter(scene => scene.type !== 'confession'),
  ]) {
    const result = resolveScenes(input)
    assert.equal(result.usedFallback, true)
    assert.equal(result.scenes[0].type, 'invitation')
    assert.equal(result.scenes[1].type, 'confession')
    assert.equal(result.scenes.at(-1).type, 'closing')
  }
})

test('scrolling narrative HTML contains every fragment and only the final reveal button', () => {
  const html = renderStory(begun)
  for (const scene of scenes.filter(scene => scene.type === 'narrative')) {
    for (const fragment of scene.fragments) assert.ok(html.includes(fragment))
  }
  assert.equal((html.match(/<button/g) ?? []).length, 1)
  assert.ok(!html.includes('I like you.'))
  assert.ok(!html.includes('chapter-closing'))
  assert.ok(html.includes('Scroll to let it unfold'))
})

test('Final Click reveals confession, unlocks closing, and maintains unique heading IDs', () => {
  const html = renderStory(revealed)
  assert.ok(html.includes('I like you.'))
  assert.ok(html.includes('chapter-closing'))
  assert.ok(html.includes(storyConfig.labels.replay))
  for (const scene of scenes.slice(1)) {
    assert.equal((html.match(new RegExp(`id="heading-${scene.id}"`, 'g')) ?? []).length, 1)
    assert.ok(html.includes(`aria-labelledby="heading-${scene.id}"`))
  }
})

test('neutral greeting and long quoted text render safely', () => {
  const name = storyConfig.recipientName
  try {
    storyConfig.recipientName = ''
    assert.ok(render(scenes[0]).includes('Hey, you.'))
  } finally {
    storyConfig.recipientName = name
  }
  const scene = {
    ...scenes[1],
    heading: 'A long heading '.repeat(20),
    fragments: ['Quotes: "hello", and it\'s.\n<script>never execute</script>'],
  }
  const html = render(scene, 1)
  assert.ok(html.includes('&lt;script&gt;never execute&lt;/script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(!html.includes('undefined'))
})

test('sound defaults to off, with no media element or volume panel', () => {
  const html = renderToStaticMarkup(createElement(SoundControl))
  assert.ok(html.includes('Sound off'))
  assert.ok(html.includes('aria-pressed="false"'))
  assert.ok(!html.includes('type="range"'))
})

test('the initial app renders only the hero and never mounts the scroll story early', () => {
  const previousWindow = globalThis.window
  globalThis.window = { matchMedia: () => ({ matches: true }) }
  try {
    const html = renderToStaticMarkup(createElement(App))
    assert.ok(html.includes('hero-stage'))
    assert.ok(!html.includes('class="scroll-story"'))
    assert.ok(html.includes(`Chapter 1 of ${configured.scenes.length}`))
    assert.ok(html.includes(storyConfig.scenes[0].continueLabel ?? storyConfig.labels.begin))
    assert.ok(!html.includes('I like you.'))
    assert.ok(!/<(?:img|audio|video)\b/.test(html))
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})
