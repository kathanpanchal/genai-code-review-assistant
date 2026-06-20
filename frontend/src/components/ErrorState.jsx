export default function ErrorState({ message, onRetry }) {
  return (
    <div className="p-6 rounded-xl glass">
      <div className="text-red-300 font-semibold">Unable to analyze pull request.</div>
      <div className="text-slate-300 mt-2">{message}</div>
      {onRetry && (
        <div className="mt-4">
          <button onClick={onRetry} className="px-4 py-2 rounded bg-red-500 hover:opacity-90">Retry</button>
        </div>
      )}
    </div>
  )
}
