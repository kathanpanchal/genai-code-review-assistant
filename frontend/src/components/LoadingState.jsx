export default function LoadingState({ step }) {
  return (
    <div className="p-6 rounded-xl glass text-center">
      <div className="font-semibold">Analyzing...</div>
      <div className="text-sm text-slate-300 mt-2">{step}</div>
    </div>
  )
}
