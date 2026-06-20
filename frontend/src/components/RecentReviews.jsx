export default function RecentReviews({ reviews = [] }) {
  return (
    <section className="glass rounded-xl p-6">
      <div className="mb-5">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">Recent Reviews</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Pull request activity</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[1.4fr_0.6fr_0.7fr_1fr] gap-4 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <div>Repository</div><div>PR Number</div><div>Issues</div><div>Date</div>
          </div>

          <div className="divide-y divide-white/10">
            {reviews.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">No reviews recorded yet.</div>
            ) : reviews.map((review) => (
              <div key={`${review.repo_name}-${review.pr_number}-${review.created_at}`} className="grid grid-cols-[1.4fr_0.6fr_0.7fr_1fr] gap-4 px-4 py-4 text-sm">
                <a href={review.pr_url} target="_blank" rel="noreferrer" className="truncate font-medium text-slate-100 hover:text-violet-300">{review.repo_name}</a>
                <div className="text-slate-300">#{review.pr_number}</div>
                <div className="text-blue-200">{review.total_issues}</div>
                <div className="text-slate-400">{formatDate(review.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString()
}
