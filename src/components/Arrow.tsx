export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="none"
      style={{ transform: down ? 'rotate(90deg)' : undefined }}
    >
      <path d="M1 7H20M14 1L20 7L14 13" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}
