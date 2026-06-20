import { useState } from 'react'

export default function PRInputCard({ onAnalyze, loadingState }) {
  const [url, setUrl] = useState('')

  function handleAnalyze() {
    if (!url) return
    onAnalyze(url)
  }

  return (
    <div className="input-panel rounded-xl p-8">
      <div className="mb-5 flex items-center gap-4">
        <div className="icon-tile">
          <IconLink />
        </div>
        <h2 className="text-xl font-bold text-white">Paste GitHub Pull Request URL</h2>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <label className="relative flex-1">
          <span className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500">
            <IconLink />
          </span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository/pull/123"
            className="h-[62px] w-full rounded-lg border border-slate-600/80 bg-slate-950/45 pl-14 pr-5 text-lg text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          />
        </label>

        <button
          onClick={handleAnalyze}
          disabled={Boolean(loadingState)}
          className="flex h-[62px] min-w-[212px] items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-violet-500 to-blue-600 px-8 text-lg font-bold text-white shadow-[0_18px_46px_rgba(82,71,255,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_54px_rgba(82,71,255,0.45)] disabled:cursor-not-allowed disabled:opacity-80"
        >
          <IconSpark />
          <span>{loadingState ? loadingState : 'Analyze PR'}</span>
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
        <span className="h-6 w-6 text-emerald-500">
          <IconShield />
        </span>
        <span>We only analyze public repositories. Your code is safe and secure.</span>
      </div>
    </div>
  )
}

function IconLink() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.2-1.2" /></svg>
}

function IconSpark() {
  return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5 14.6 9l6.4 3-6.4 3L12 21.5 9.4 15 3 12l6.4-3L12 2.5Z" /></svg>
}

function IconShield() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2 20 5.5v5.9c0 5-3.4 9.6-8 10.9-4.6-1.3-8-5.9-8-10.9V5.5l8-3.3Zm3.5 7.2-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5 6-6-1.4-1.4Z" /></svg>
}
