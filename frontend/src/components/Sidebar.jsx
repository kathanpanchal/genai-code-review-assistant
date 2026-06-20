export default function Sidebar({
  active = "analyze",
  onNavigate = () => {}
}) {
  return (
    <aside className="sidebar-shell hidden min-h-screen w-[306px] shrink-0 flex-col border-r border-white/10 px-6 py-8 text-white lg:flex">
      <div className="mb-10 flex items-center gap-4">
        <div className="brand-bot">
          <IconRobot />
        </div>

        <div>
          <h1 className="text-[30px] font-extrabold leading-none tracking-normal">
            GenAI
          </h1>

          <p className="mt-1 text-[17px] leading-tight text-slate-300">
            Code Review Assistant
          </p>
        </div>
      </div>

      <nav className="space-y-3">
        <NavButton
          label="Analyze PR"
          icon={<IconBolt />}
          active={active === "analyze"}
          onClick={() => onNavigate("analyze")}
        />

        <NavButton
          label="Dashboard"
          icon={<IconBars />}
          active={active === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
      </nav>

      <div className="mt-10 space-y-6">
        <div className="sidebar-card flex items-center gap-4 p-5">
          <IconSpark className="h-8 w-8 text-violet-300" />

          <div>
            <div className="text-sm text-slate-400">
              Powered by
            </div>

            <div className="text-lg font-bold text-violet-300">
              Gemini AI
            </div>
          </div>
        </div>

        <div className="sidebar-card p-5">
          <h2 className="mb-4 text-base font-bold">
            How it works
          </h2>

          <ol className="space-y-3 text-sm text-slate-300">
            <Step
              number="1"
              text="Paste a GitHub PR URL"
            />

            <Step
              number="2"
              text="We fetch the changes"
            />

            <Step
              number="3"
              text="AI analyzes the code"
            />

            <Step
              number="4"
              text="Get intelligent feedback"
            />
          </ol>
        </div>
      </div>

      <div className="mt-auto -mx-6 border-t border-white/10 px-8 pt-5">
        <a
          href="https://github.com"
          className="flex items-center gap-3 text-base text-slate-200 transition hover:text-white"
          target="_blank"
          rel="noreferrer"
        >
          <IconGithub />

          <span>Star on GitHub</span>

          <span className="text-slate-400">
            &#8599;
          </span>
        </a>

        <p className="mt-6 text-sm text-slate-500">
          &copy; 2026 GenAI Code Review
        </p>
      </div>
    </aside>
  );
}

function NavButton({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[54px] w-full items-center gap-4 rounded-lg px-4 text-left text-[18px] transition ${
        active
          ? "border border-violet-500/70 bg-gradient-to-r from-violet-700/80 to-indigo-950/80 text-white shadow-[0_14px_42px_rgba(96,60,255,0.3)]"
          : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <span
        className={`h-6 w-6 ${
          active ? "text-white" : "text-slate-400"
        }`}
      >
        {icon}
      </span>

      <span className="font-medium">
        {label}
      </span>
    </button>
  );
}

function Step({ number, text }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
        {number}
      </span>

      <span>{text}</span>
    </li>
  );
}

function IconRobot() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect
        x="7"
        y="11"
        width="34"
        height="29"
        rx="8"
        fill="url(#robotGradient)"
      />

      <rect
        x="13"
        y="19"
        width="22"
        height="13"
        rx="4"
        fill="#0d1633"
      />

      <circle cx="18" cy="25.5" r="2.8" fill="#77b9ff" />
      <circle cx="30" cy="25.5" r="2.8" fill="#77b9ff" />

      <rect
        x="17"
        y="35"
        width="14"
        height="3"
        rx="1.5"
        fill="#0d1633"
        opacity=".75"
      />

      <path
        d="M24 11V5"
        stroke="#8b5cf6"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle cx="24" cy="4" r="2.3" fill="#8b5cf6" />

      <defs>
        <linearGradient
          id="robotGradient"
          x1="7"
          y1="11"
          x2="41"
          y2="40"
        >
          <stop stopColor="#61d7ff" />
          <stop offset=".45" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconBolt() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.6 2.4 4.8 13h6.1l-1.5 8.6L19.2 9h-6.4l.8-6.6Z" />
    </svg>
  );
}

function IconBars() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 20V10M12 20V4M19 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

function IconSpark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5 14.7 9l6.8 3-6.8 3L12 21.5 9.3 15l-6.8-3 6.8-3L12 2.5Z" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.2-4.7-5A3.9 3.9 0 0 1 6.6 9c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
