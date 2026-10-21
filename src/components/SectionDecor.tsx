import type { Scene } from '../content/story'

interface Props {
  scene: Scene
  index: number
  stage?: 'hero' | 'story'
}

function getKind(scene: Scene) {
  return scene.type === 'narrative' ? scene.layout : scene.type
}

export function SectionDecor({ scene, index, stage = 'story' }: Props) {
  const kind = getKind(scene)
  return <div className={`section-decor section-decor-${kind} ${stage === 'hero' ? 'is-hero' : ''}`} aria-hidden="true">
    <span className="decor-orbit decor-orbit-one" />
    <span className="decor-orbit decor-orbit-two" />
    <svg className="decor-glyph" viewBox="0 0 200 200" fill="none">
      {kind === 'invitation' && <>
        <path className="decor-heart" d="M100 157C91 148 43 121 43 79C43 59 56 47 72 47C85 47 94 55 100 66C106 55 115 47 128 47C144 47 157 59 157 79C157 121 109 148 100 157Z" />
        <path className="decor-heart-inner" d="M100 143C91 134 57 113 57 82C57 68 65 59 76 59C87 59 96 68 100 77C104 68 113 59 124 59C135 59 143 68 143 82C143 113 109 134 100 143Z" />
        <path className="decor-spark" d="M31 45V67M20 56H42M164 120V138M155 129H173" />
      </>}
      {kind === 'editorial' && <>
        <path className="decor-thread" d="M32 58C63 53 76 75 99 76C121 77 133 58 168 63" />
        <path className="decor-heart-small" d="M100 107C95 102 82 95 82 84C82 78 86 74 91 74C95 74 98 77 100 81C102 77 105 74 109 74C114 74 118 78 118 84C118 95 105 102 100 107Z" />
        <circle className="decor-dot" cx="48" cy="122" r="3" /><circle className="decor-dot" cx="159" cy="112" r="2" />
      </>}
      {kind === 'fragments' && <>
        <path className="decor-vertical" d="M93 24V176" />
        <circle className="decor-dot decor-dot-large" cx="93" cy="42" r="7" /><circle className="decor-dot" cx="93" cy="100" r="4" /><circle className="decor-dot" cx="93" cy="158" r="2.5" />
        <path className="decor-heart-small" d="M133 91C128 86 115 79 115 68C115 62 119 58 124 58C128 58 131 61 133 65C135 61 138 58 142 58C147 58 151 62 151 68C151 79 138 86 133 91Z" />
      </>}
      {kind === 'quotation' && <>
        <path className="decor-quote" d="M45 80H71C71 98 64 109 49 114M86 80H112C112 98 105 109 90 114" />
        <path className="decor-heart-small" d="M131 132C126 127 113 120 113 109C113 103 117 99 122 99C126 99 129 102 131 106C133 102 136 99 140 99C145 99 149 103 149 109C149 120 136 127 131 132Z" />
        <path className="decor-spark" d="M153 45V63M144 54H162" />
      </>}
      {kind === 'realization' && <>
        <ellipse className="decor-ring" cx="100" cy="100" rx="63" ry="30" transform="rotate(-28 100 100)" />
        <ellipse className="decor-ring decor-ring-soft" cx="100" cy="100" rx="78" ry="43" transform="rotate(28 100 100)" />
        <path className="decor-heart-small" d="M100 122C95 117 82 110 82 99C82 93 86 89 91 89C95 89 98 92 100 96C102 92 105 89 109 89C114 89 118 93 118 99C118 110 105 117 100 122Z" />
        <circle className="decor-dot decor-dot-large" cx="158" cy="51" r="5" />
      </>}
      {kind === 'quiet' && <>
        <path className="decor-quiet-line" d="M35 101C61 101 70 101 88 101C110 101 125 101 166 101" />
        <path className="decor-heart-small" d="M99 90C95 86 85 81 85 73C85 68 89 65 93 65C96 65 98 67 99 70C101 67 103 65 106 65C110 65 114 68 114 73C114 81 104 86 99 90Z" />
        <circle className="decor-dot" cx="35" cy="101" r="3" /><circle className="decor-dot" cx="166" cy="101" r="3" />
      </>}
      {kind === 'confession' && <>
        <path className="decor-heart confession-heart" d="M100 161C89 150 35 120 35 72C35 49 50 35 69 35C84 35 94 44 100 57C106 44 116 35 131 35C150 35 165 49 165 72C165 120 111 150 100 161Z" />
        <path className="decor-pulse" d="M25 101H55L65 87L76 115L88 95L98 105H125L137 82L149 105H175" />
        <path className="decor-spark" d="M100 13V29M92 21H108M179 60V76M171 68H187" />
      </>}
      {kind === 'closing' && <>
        <path className="decor-constellation" d="M34 133L72 80L122 106L163 53" />
        <circle className="decor-dot decor-dot-large" cx="34" cy="133" r="5" /><circle className="decor-dot" cx="72" cy="80" r="3" /><circle className="decor-dot" cx="122" cy="106" r="4" /><circle className="decor-dot" cx="163" cy="53" r="5" />
        <path className="decor-heart-small" d="M113 68C109 64 99 59 99 51C99 47 102 44 106 44C109 44 111 46 113 49C115 46 117 44 120 44C124 44 127 47 127 51C127 59 117 64 113 68Z" />
      </>}
    </svg>
    <span className="decor-index">{String(index + 1).padStart(2, '0')}</span>
  </div>
}
