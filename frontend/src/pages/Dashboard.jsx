import { useEffect, useMemo, useState } from "react";

import DashboardStats from "../components/DashboardStats";
import DashboardChart from "../components/DashboardChart";
import RecentReviews from "../components/RecentReviews";
import { getMetrics } from "../services/api";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMetrics() {
      try {
        const data = await getMetrics();

        if (isMounted) {
          setMetrics(data || {});
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setMetrics({});
          setError(err.message || "Dashboard metrics are temporarily unavailable.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const distribution = useMemo(
    () => deriveDistribution(metrics),
    [metrics]
  );

  return (
    <div className="mx-auto w-full max-w-[1180px] pt-8">
      <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
            Metrics dashboard
          </div>

          <h1 className="text-4xl font-extrabold tracking-normal text-white sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-400">
            Monitor review throughput, cache efficiency, issue severity, and recent pull request activity.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
          <div className="text-slate-500">
            Cache Hits
          </div>

          <div className="mt-1 text-xl font-bold text-white">
            {formatNumber(toNumber(metrics?.hits))}
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {error} Showing fallback analytics until the API responds.
        </div>
      )}

      {loading ? (
        <div className="glass rounded-xl p-8 text-slate-300">
          Loading dashboard metrics...
        </div>
      ) : (
        <div className="space-y-6">
          <DashboardStats metrics={metrics} />

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <DashboardChart distribution={distribution} />
            <RecentReviews reviews={metrics?.recent_reviews} />
          </div>
        </div>
      )}
    </div>
  );
}

function deriveDistribution(metrics) {
  const high = firstNumber(metrics?.high_count);

  const medium = firstNumber(
    metrics?.medium_count
  );

  const low = firstNumber(
    metrics?.low_count
  );

  return {
    high,
    medium,
    low
  };
}

function firstNumber(...values) {
  for (const value of values) {
    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return 0;
}

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
