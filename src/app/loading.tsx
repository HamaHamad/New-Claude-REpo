export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{
            borderColor: 'var(--brand-glow)',
            borderTopColor: 'var(--brand)',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          Loading…
        </span>
      </div>
    </div>
  )
}
