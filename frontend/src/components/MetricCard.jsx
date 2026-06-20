export default function MetricCard({ title, value, color, icon = 'file' }) {
  return (
    <div className="metric-chip">
      <span className="h-5 w-5" style={{ color }}>
        {icon === 'circle' ? <IconCircle /> : <IconFile />}
      </span>
      <span className="font-semibold text-white">{value}</span>
      <span className="text-white">{title}</span>
    </div>
  )
}

function IconFile() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" /><path d="M14 2v5h5" /></svg>
}

function IconCircle() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><circle cx="12" cy="12" r="8" /></svg>
}
