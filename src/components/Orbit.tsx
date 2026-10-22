export function Orbit() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="ambient-light" />
      <svg className="orbit" viewBox="0 0 1000 1000" fill="none">
        <g className="orbit-system">
          <circle className="orbit-outer" cx="500" cy="500" r="400" />
          <ellipse
            className="orbit-inner"
            cx="500"
            cy="500"
            rx="308"
            ry="400"
            transform="rotate(-32 500 500)"
          />
          <path className="orbit-arc" d="M 100 500 A 400 400 0 0 1 500 100" />
          <g className="orbit-star" transform="translate(500 100)">
            <path d="M0-10C0-2 2 0 10 0C2 0 0 2 0 10C0 2-2 0-10 0C-2 0 0-2 0-10Z" />
          </g>
          <circle className="orbit-dot" cx="900" cy="500" r="3" />
        </g>
      </svg>
      <div className="grain" />
    </div>
  )
}
