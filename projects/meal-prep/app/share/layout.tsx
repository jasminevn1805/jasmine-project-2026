export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight:  '100dvh',
        background: 'var(--color-background-primary)',
      }}
    >
      <div
        style={{
          maxWidth: '1080px',
          margin:   '0 auto',
          padding:  'var(--space-2xl) var(--space-l)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
