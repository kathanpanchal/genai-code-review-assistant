import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Hero from '../components/Hero'
import Dashboard from './Dashboard'
import PRInputCard from '../components/PRInputCard'
import MetricCard from '../components/MetricCard'
import IssueCard from '../components/IssueCard'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { reviewPullRequest } from '../services/api'

export default function ReviewPage() {
    const [activeTab, setActiveTab] = useState('analyze')
    const [issues, setIssues] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState(null)

    async function analyze(prUrl) {
        setError(null)
        setLoading(true)
        setIssues(null)

        const steps = [
            'Fetching diff...',
            'Running Gemini review...',
            'Generating suggestions...'
        ]

        try {
            for (let i = 0; i < steps.length; i++) {
                setLoadingStep(steps[i])
                // small delay for UX
                await new Promise((r) => setTimeout(r, 600))
            }

            const res = await reviewPullRequest(prUrl)

            if (res?.issues) {
                setIssues(res.issues)
            } else {
                setIssues([])
            }
        } catch (err) {
            setError(err.message || 'Please verify the PR URL and try again.')
        } finally {
            setLoading(false)
            setLoadingStep('')
        }
    }

    const totals = {
        total: issues ? issues.length : 0,
        high: issues ? issues.filter((i) => i.severity?.toLowerCase() === 'high').length : 0,
        medium: issues ? issues.filter((i) => i.severity?.toLowerCase() === 'medium').length : 0,
        low: issues ? issues.filter((i) => i.severity?.toLowerCase() === 'low').length : 0,
    }

    return (
        <div className="app-shell min-h-screen text-white">
            <div className="flex min-h-screen">
                <Sidebar
                    active={activeTab}
                    onNavigate={setActiveTab}
                />

                <main className="relative flex-1 px-5 py-8 sm:px-8 lg:px-9">
                    <a
                        href="https://github.com/kathanpanchal/genai-code-review-assistant"
                        target="_blank"
                        rel="noreferrer"
                        className="github-star absolute right-7 top-6 hidden items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-950/50 px-4 py-2 text-base text-white shadow-lg transition hover:border-violet-400/50 hover:bg-slate-900/70 xl:flex"
                    >
                        <span className="text-yellow-400">&#9733;</span>
                        <span>Star on GitHub</span>
                    </a>

                    {activeTab === 'dashboard' ? (
                        <Dashboard />
                    ) : (
                        <div className="mx-auto w-full max-w-[1130px] pt-10">
                            <Hero />

                            <PRInputCard onAnalyze={analyze} loadingState={loading ? loadingStep || 'Analyzing...' : null} />

                            <section className="mt-8">
                                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="icon-tile h-12 w-12">
                                            <IconReview />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Review Results</h2>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <MetricCard title="Issues Found" value={totals.total} color="#60a5fa" />
                                        <MetricCard title="High" value={totals.high} color="#ff4545" icon="circle" />
                                        <MetricCard title="Low" value={totals.low} color="#fbbf24" icon="circle" />
                                    </div>
                                </div>

                                {error && <ErrorState message={error} onRetry={() => { setError(null) }} />}

                                {loading && <LoadingState step={loadingStep} />}

                                {!loading && !issues && <EmptyState />}

                                {!loading && issues && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {issues.length === 0 && (
                                            <div className="glass rounded-xl p-6 text-slate-200">No issues found.</div>
                                        )}

                                        {issues.map((issue, idx) => (
                                            <IssueCard issue={issue} key={`${issue.file}-${idx}`} />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

function IconReview() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M15 3v5h4" /><path d="M8 13h6" /><path d="M8 17h8" /><path d="M8 9h3" /></svg>
}
