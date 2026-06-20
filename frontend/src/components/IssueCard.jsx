const severityMap = {
  high: {
    label: 'HIGH',
    rail: 'bg-red-500',
    accent: 'text-red-400',
    badge: 'border-red-500/25 bg-red-500/15 text-red-400',
    icon: 'error',
  },
  medium: {
    label: 'MEDIUM',
    rail: 'bg-orange-400',
    accent: 'text-orange-300',
    badge: 'border-orange-400/25 bg-orange-400/15 text-orange-300',
    icon: 'warning',
  },
  low: {
    label: 'LOW',
    rail: 'bg-amber-400',
    accent: 'text-amber-300',
    badge: 'border-amber-400/25 bg-amber-400/15 text-amber-300',
    icon: 'warning',
  },
}

export default function IssueCard({ issue }) {
  const sev = severityMap[issue.severity?.toLowerCase()] || severityMap.low

  return (
    <article className="issue-card relative overflow-hidden rounded-xl border border-slate-700/80">
      <div className={`absolute left-0 top-0 h-full w-[3px] ${sev.rail}`} />
      <div className="grid gap-5 px-7 py-5 md:grid-cols-[130px_1fr_auto] md:items-start">
        <div className="flex items-center gap-4">
          <span className={`h-10 w-10 ${sev.accent}`}>
            {sev.icon === 'error' ? <IconError /> : <IconWarning />}
          </span>
          <span className={`rounded-lg border px-3 py-2 text-sm font-bold tracking-wide ${sev.badge}`}>
            {sev.label}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight text-white">{issue.category || 'Issue'}</h3>
          <p className="mt-2 max-w-4xl text-[17px] leading-8 text-slate-300">{issue.comment}</p>
        </div>

        {issue.file && (
          <div className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-500/25 bg-blue-500/10 px-4 text-base text-blue-300">
            <IconFile />
            <span>{issue.file}</span>
          </div>
        )}
      </div>
    </article>
  )
}

function IconError() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v7" /><path d="M12 17.5v.2" /></svg>
}

function IconWarning() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v5" /><path d="M12 17.5v.2" /></svg>
}

function IconFile() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" /><path d="M14 2v5h5" /></svg>
}
