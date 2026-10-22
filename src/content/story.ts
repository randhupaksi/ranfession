import { z } from 'zod'

// Personalize this file. IDs must be unique; chapter counts and order are automatic.
const base = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  heading: z.string().trim().min(1),
  emphasis: z.string().optional(),
  continueLabel: z.string().trim().min(1).optional(),
  revealLabel: z.string().trim().min(1).optional(),
})
export const sceneSchema = z.discriminatedUnion('type', [
  base.extend({ type: z.literal('invitation'), body: z.string().min(1) }),
  base.extend({
    type: z.literal('narrative'),
    layout: z.enum(['editorial', 'fragments', 'quotation', 'realization', 'quiet']),
    fragments: z.array(z.string().trim().min(1)).min(1),
  }),
  base.extend({
    type: z.literal('confession'),
    introduction: z.string().min(1),
    confession: z.string().trim().min(1),
    supporting: z.string().min(1),
  }),
  base.extend({ type: z.literal('closing'), body: z.string().min(1) }),
])
export type Scene = z.infer<typeof sceneSchema>

export const storyConfig = {
  title: 'Ranfession — A few honest words',
  recipientName: '',
  senderName: '',
  dedication: 'To you, with a little courage.',
  visuals: { orbitalAccent: true, grain: true },
  labels: {
    begin: 'Begin',
    reveal: 'Reveal',
    continue: 'Continue',
    back: 'Back',
    replay: 'Read again',
  },
  scenes: [
    {
      id: 'invitation',
      type: 'invitation',
      label: 'A little something for you',
      heading: 'Some things are',
      emphasis: 'worth saying.',
      body: 'A little story. A few honest words.\nAnd you, on the other side of them.',
    },
    {
      id: 'beginning',
      type: 'narrative',
      layout: 'editorial',
      label: 'The beginning',
      heading: 'It started with',
      emphasis: 'something small.',
      fragments: [
        "At first, I didn't think much of it. Just a conversation. An ordinary moment.",
        'But sometimes, the smallest things quietly become the ones that matter.',
      ],
    },
    {
      id: 'little-things',
      type: 'narrative',
      layout: 'fragments',
      label: 'The little things',
      heading: "It's the little things",
      emphasis: 'that stay.',
      fragments: [
        'The way you make ordinary moments feel a little lighter.',
        "The conversations I didn't want to end.",
        "The kindness you probably don't even notice.",
      ],
    },
    {
      id: 'moments',
      type: 'narrative',
      layout: 'quotation',
      label: 'Unnoticed moments',
      heading: 'Some moments',
      emphasis: 'stay with you.',
      fragments: [
        'Not because they were extraordinary, but because they meant more to me than I expected.',
        'Small, quiet moments. The kind I found myself thinking about again.',
      ],
    },
    {
      id: 'realization',
      type: 'narrative',
      layout: 'realization',
      label: 'The realization',
      heading: 'Somewhere along the way,',
      emphasis: 'something changed.',
      fragments: [
        'You became someone special to me.',
        'Not all at once. Just quietly, in a way I could no longer overlook.',
      ],
    },
    {
      id: 'unsaid',
      type: 'narrative',
      layout: 'quiet',
      label: 'Something unsaid',
      heading: "There's one thing",
      emphasis: "I haven't said.",
      fragments: ["And I think it's time I finally did."],
    },
    {
      id: 'confession',
      type: 'confession',
      label: 'One last thing',
      heading: 'A little courage.',
      emphasis: 'One honest sentence.',
      introduction: "There's something I want you to know.",
      confession: 'I like you.',
      supporting: 'I just wanted to be honest about how I feel.',
    },
    {
      id: 'last-page',
      type: 'closing',
      label: 'The last page',
      heading: 'Whatever you feel,',
      emphasis: 'thank you for reading.',
      body: "I didn't make this to ask for an answer.\nI just wanted to tell you something that matters to me.\n\nI'm glad I found the courage to say it.",
    },
  ] satisfies Scene[],
}

// A separate safe fallback remains valid even when the editable story is broken.
const fallbackScenes: Scene[] = [
  {
    id: 'safe-invitation',
    type: 'invitation',
    label: 'A note for you',
    heading: 'A few honest words.',
    body: 'Something small, and sincerely meant.',
  },
  {
    id: 'safe-confession',
    type: 'confession',
    label: 'One last thing',
    heading: 'Something worth saying.',
    introduction: "There's something I want you to know.",
    confession: 'I like you.',
    supporting: 'I just wanted to be honest about how I feel.',
  },
  {
    id: 'safe-closing',
    type: 'closing',
    label: 'The last page',
    heading: 'Thank you for reading.',
    body: 'Whatever you feel, nothing is owed. I just wanted to share this with you.',
  },
]

export function resolveScenes(input: unknown): { scenes: Scene[]; usedFallback: boolean } {
  if (!Array.isArray(input)) return { scenes: fallbackScenes, usedFallback: true }
  const scenes: Scene[] = []
  const ids = new Set<string>()
  for (const candidate of input) {
    const result = sceneSchema.safeParse(candidate)
    if (result.success && !ids.has(result.data.id)) {
      ids.add(result.data.id)
      scenes.push(result.data)
    }
  }
  const invitation = scenes.findIndex(scene => scene.type === 'invitation')
  const confession = scenes.findIndex(scene => scene.type === 'confession')
  const closing = scenes.findIndex(scene => scene.type === 'closing')
  const valid =
    invitation === 0 &&
    confession > invitation &&
    closing === scenes.length - 1 &&
    closing > confession &&
    scenes.filter(scene => scene.type === 'confession').length === 1 &&
    scenes.filter(scene => scene.type === 'invitation').length === 1 &&
    scenes.filter(scene => scene.type === 'closing').length === 1
  return valid
    ? { scenes, usedFallback: scenes.length !== input.length }
    : { scenes: fallbackScenes, usedFallback: true }
}
