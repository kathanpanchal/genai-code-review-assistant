const possibleReasons = [
  'Pull Request does not exist',
  'Repository is private',
  'GitHub API rate limit reached',
  'Pull Request diff is too large',
]

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass rounded-xl border-red-500/25 p-6">
      <div className="font-semibold text-red-300">Unable to analyze PR.</div>
      <div className="mt-2 text-slate-300">{message}</div>
      <div className="mt-4 text-sm font-medium text-slate-200">Possible reasons:</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
        {possibleReasons.map((reason) => <li key={reason}>{reason}</li>)}
      </ul>
      {onRetry && (
        <button onClick={onRetry} className="mt-5 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:opacity-90">
          Dismiss
        </button>
      )}
    </div>
  )
}
