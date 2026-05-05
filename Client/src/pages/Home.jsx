import { Link } from "react-router-dom";

const skills = [
  "React", "Node.js", "Python", "ML / AI", "Flutter", "UI/UX", "DevOps",
  "IoT", "Cybersecurity", "DSA", "Blockchain", "AR/VR", "Game Dev", "Java",
];

const projects = [
  { emoji: "🤖", tag: "AI/ML", title: "Smart Campus Assistant", members: 3, open: 2 },
  { emoji: "🎮", tag: "Game Dev", title: "Multiplayer AR Puzzle", members: 2, open: 3 },
  { emoji: "🌱", tag: "IoT", title: "Smart Agriculture Monitor", members: 4, open: 1 },
];

const Home = () => (
  <div className="min-h-screen bg-[#f5f3ff] font-sans overflow-x-hidden">

    {/* ── Scrolling skill ticker ── */}
    <div className="bg-indigo-600 text-white py-2.5 overflow-hidden border-y border-indigo-700 whitespace-nowrap">
      <div className="inline-flex gap-8 animate-marquee">
        {[...skills, ...skills].map((s, i) => (
          <span key={i} className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <span className="text-indigo-300">✦</span> {s}
          </span>
        ))}
      </div>
    </div>

    {/* ── HERO ── */}
    <section className="relative px-5 sm:px-8 pt-16 pb-10 max-w-6xl mx-auto">

      {/* floating blobs — positioned outside normal flow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-[300px] sm:h-[300px] rounded-full bg-pink-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT — copy */}
        <div>
          {/* eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live for SRM Students
          </div>

          <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900 mb-6">
            Stop scrolling<br />
            LinkedIn for{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-indigo-600">teammates.</span>
              {/* squiggly underline */}
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,5 C30,1 60,9 100,5 C140,1 170,9 200,5" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            SRMHive is where campus ideas actually get built — post your project,
            find people who give a damn, and ship something real.
          </p>

          <div className="flex flex-col xs:flex-row gap-3 w-full">
            <Link
              to="/browse-projects"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] rounded-xl shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
            >
              Explore Projects →
            </Link>
            <Link
              to="/register"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold text-[15px] rounded-xl hover:border-indigo-300 hover:-translate-y-0.5 transition-all"
            >
              Join Free
            </Link>
          </div>

          {/* mini social proof */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["🧑‍💻","👩‍🎨","🧑‍🔬","👨‍💼"].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-sm shadow-sm">
                  {e}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">500+</span> students already in
            </p>
          </div>
        </div>

        {/* RIGHT — project preview cards */}
        <div className="relative hidden md:block">
          <div className="relative w-full max-w-sm mx-auto space-y-3">
            {projects.map((p, i) => (
              <div
                key={i}
                style={{ transform: `rotate(${i % 2 === 0 ? -1.2 : 1.2}deg)` }}
                className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 hover:rotate-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{p.emoji}</div>
                    <div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{p.tag}</span>
                      <p className="font-bold text-slate-800 text-sm mt-1">{p.title}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-3">
                  <span>👥 {p.members} members</span>
                  <span className="bg-green-50 text-green-600 font-bold px-2.5 py-0.5 rounded-full">{p.open} spots open</span>
                </div>
              </div>
            ))}
            {/* decorative label */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 font-black text-xs px-3 py-1.5 rounded-xl rotate-6 shadow-md">
              LIVE NOW ✦
            </div>
          </div>
        </div>
      </div>
    </section>



    {/* ── How it works — numbered bento ── */}
    <section className="px-5 sm:px-8 py-20 max-w-6xl mx-auto">
      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">How it works</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          3 steps. No fluff.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            num: "01",
            bg: "bg-indigo-600",
            text: "text-white",
            sub: "text-indigo-200",
            icon: "✏️",
            title: "Post your idea",
            desc: "Write what you're building, what skills you need, and boom — it's live.",
          },
          {
            num: "02",
            bg: "bg-violet-500",
            text: "text-white",
            sub: "text-violet-200",
            icon: "🔍",
            title: "Find your crew",
            desc: "Browse people by skill, not resume. Apply to projects that excite you.",
          },
          {
            num: "03",
            bg: "bg-yellow-400",
            text: "text-yellow-950",
            sub: "text-yellow-700",
            icon: "🚀",
            title: "Build together",
            desc: "Team chat unlocks once you're in. Ship something you're proud of.",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`${s.bg} rounded-3xl p-7 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 transition-transform duration-300 shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl">{s.icon}</span>
              <span className={`font-black text-6xl opacity-20 ${s.text} leading-none`}>{s.num}</span>
            </div>
            <div className="mt-6">
              <h3 className={`text-lg font-extrabold ${s.text} mb-1`}>{s.title}</h3>
              <p className={`text-sm ${s.sub} leading-relaxed`}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="px-5 sm:px-8 pb-24 max-w-4xl mx-auto">
      <div className="relative bg-slate-900 rounded-3xl px-8 py-14 sm:px-14 text-center overflow-hidden">
        {/* deco circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-indigo-600/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-violet-600/30 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-block bg-yellow-400 text-yellow-900 font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Free. Always.
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Your next project<br />is one click away.
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
            No subscriptions. No nonsense. Just SRM students building cool stuff.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[15px] rounded-xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
            >
              Create an account →
            </Link>
            <Link
              to="/browse-projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-[15px] rounded-xl border border-white/20 hover:-translate-y-0.5 transition-all"
            >
              Browse first
            </Link>
          </div>
        </div>
      </div>
    </section>

  </div>
);

export default Home;