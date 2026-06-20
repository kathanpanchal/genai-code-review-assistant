const fallbackReviews = [
  {
    repository: "genai-code-review-test/pull/1",
    issues: 3,
    timestamp: "2 mins ago",
    status: "Reviewed"
  },
  {
    repository: "frontend-dashboard/pull/8",
    issues: 5,
    timestamp: "18 mins ago",
    status: "Cached"
  },
  {
    repository: "fastapi-review-service/pull/14",
    issues: 2,
    timestamp: "1 hour ago",
    status: "Reviewed"
  },
  {
    repository: "gemini-review-agent/pull/22",
    issues: 7,
    timestamp: "Yesterday",
    status: "Reviewed"
  }
];

export default function RecentReviews({ reviews = fallbackReviews }) {
  const rows = Array.isArray(reviews) && reviews.length > 0
    ? reviews
    : fallbackReviews;

  return (
    <section className="glass rounded-xl p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
            Recent Reviews
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Pull request activity
          </h2>
        </div>

        <div className="hidden rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-200 sm:block">
          Live-ready
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr] gap-4 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <div>Repository</div>
          <div>Issues Found</div>
          <div>Timestamp</div>
        </div>

        <div className="divide-y divide-white/10">
          {rows.map((review) => (
            <div
              key={`${review.repository}-${review.timestamp}`}
              className="grid grid-cols-[1.5fr_0.7fr_0.8fr] gap-4 px-4 py-4 text-sm transition hover:bg-white/[0.035]"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-slate-100">
                  {review.repository}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {review.status || "Reviewed"}
                </div>
              </div>

              <div className="flex items-center">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-blue-200">
                  {review.issues} issues
                </span>
              </div>

              <div className="flex items-center text-slate-400">
                {review.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
