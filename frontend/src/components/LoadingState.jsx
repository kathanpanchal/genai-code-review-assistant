const steps = [
  { key: 'fetching', label: 'Fetching Pull Request...' },
  { key: 'analyzing', label: 'Analyzing with Gemini...' },
  { key: 'generating', label: 'Generating Review...' },
]

export default function LoadingState({ step = 'fetching' }) {
  const activeIndex = Math.max(0, steps.findIndex((item) => item.key === step))

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-violet-300/30 border-t-violet-300" />
        <div className="font-semibold text-white">Analyzing pull request</div>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-950/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300"
          style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((item, index) => (
          <li
            key={item.key}
            className={`flex items-center gap-2 text-sm ${index <= activeIndex ? 'text-violet-200' : 'text-slate-500'}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${index <= activeIndex ? 'bg-violet-400' : 'bg-slate-700'}`} />
            {item.label}
          </li>
        ))}
      </ol>
    </div>
  )
}
