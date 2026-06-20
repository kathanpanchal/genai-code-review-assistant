export default function Hero() {
  return (
    <section className="mb-9 text-center">
      <h2 className="mb-3 text-[42px] font-extrabold leading-tight tracking-normal text-white sm:text-[56px]">
        AI-Powered{' '}
        <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Code Reviews
        </span>
      </h2>
      <p className="text-lg text-slate-400 sm:text-xl">
        Paste a GitHub Pull Request URL and get intelligent code review feedback instantly.
      </p>
    </section>
  )
}
