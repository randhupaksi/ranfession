import { useAmbience } from '../hooks/useAmbience'

export function SoundControl() {
  const { status, volume, changeVolume, toggle } = useAmbience()
  const playing = status === 'playing'
  const unavailable = status === 'unavailable'
  return (
    <div className="sound-control">
      <button
        className="sound-button"
        type="button"
        onClick={() => void toggle()}
        aria-pressed={playing}
        disabled={unavailable || status === 'starting'}
        aria-label={
          unavailable
            ? 'Ambience unavailable. You can keep reading in silence.'
            : playing
              ? 'Mute ambience'
              : 'Enable ambience'
        }
      >
        <span className={`sound-bars ${playing ? 'is-playing' : ''}`} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>
          {unavailable
            ? 'Sound unavailable'
            : status === 'starting'
              ? 'Starting sound'
              : playing
                ? 'Sound on'
                : 'Sound off'}
        </span>
      </button>
      {playing && (
        <label className="volume-control">
          <span className="sr-only">Ambience volume</span>
          <input
            type="range"
            min="0.05"
            max="0.7"
            step="0.05"
            value={volume}
            onChange={event => changeVolume(Number(event.target.value))}
          />
        </label>
      )}
    </div>
  )
}
