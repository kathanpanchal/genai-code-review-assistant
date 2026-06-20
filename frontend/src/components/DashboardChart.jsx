const severityRows = [
  {
    key: "high",
    label: "High Severity",
    color: "from-red-500 to-rose-400",
    dot: "bg-red-400"
  },
  {
    key: "medium",
    label: "Medium Severity",
    color: "from-orange-400 to-amber-300",
    dot: "bg-orange-300"
  },
  {
    key: "low",
    label: "Low Severity",
    color: "from-yellow-300 to-lime-300",
    dot: "bg-yellow-300"
  }
];

export default function DashboardChart({ distribution }) {
  const data = {
    high: toNumber(distribution?.high),
    medium: toNumber(distribution?.medium),
    low: toNumber(distribution?.low)
  };

  const total =
    data.high +
    data.medium +
    data.low;

  return (
    <section className="glass rounded-xl p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
            Issue Distribution
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Severity breakdown
          </h2>
        </div>

        <p className="text-sm text-slate-400">
          {total} issues tracked
        </p>
      </div>

      <div className="space-y-5">
        {severityRows.map((row) => {
          const value = data[row.key];
          const width = total > 0
            ? Math.max(6, Math.round((value / total) * 100))
            : 0;

          return (
            <div key={row.key}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${row.dot}`} />
                  <span className="font-medium text-slate-200">
                    {row.label}
                  </span>
                </div>

                <div className="text-sm text-slate-400">
                  <span className="font-semibold text-white">
                    {value}
                  </span>
                  {" "}
                  issues
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full border border-white/5 bg-slate-950/70">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${row.color} shadow-[0_0_24px_rgba(124,58,237,0.22)] transition-all duration-500`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}
