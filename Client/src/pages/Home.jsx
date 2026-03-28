import { Link } from "react-router-dom";

const stats = [
  { value: "500+", label: "Projects Posted" },
  { value: "2K+",  label: "Students Joined" },
  { value: "98%",  label: "Match Rate" },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: "indigo",
    title: "Post Your Idea",
    desc: "Describe your project, set the skills you need, and publish in under 2 minutes.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: "violet",
    title: "Find Teammates",
    desc: "Browse projects that match your skills and passion. One click to apply.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    color: "pink",
    title: "Build Together",
    desc: "Accepted members get private team chat to coordinate in real time.",
  },
];

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    ring: "ring-indigo-100",
    badge: "bg-indigo-600",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    ring: "ring-violet-100",
    badge: "bg-violet-600",
  },
  pink: {
    bg: "bg-pink-50",
    icon: "text-pink-600",
    ring: "ring-pink-100",
    badge: "bg-pink-500",
  },
};

const Home = () => (
  <div className="mesh-bg min-h-screen font-sans overflow-hidden">

    {/* ── Hero ── */}
    <section className="relative pt-24 pb-28 px-4">
      {/* floating blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-indigo-400/10 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full bg-violet-400/10 blur-3xl animate-float delay-300" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-pink-400/8 blur-3xl animate-float delay-200" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 animate-fade-up shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse-glow" />
          Now live for SRM students ✦
        </div>

        <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-6 animate-fade-up delay-100">
          Find the Right Teammates{" "}
          <span className="gradient-text">
            For Your Next Project
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed animate-fade-up delay-200">
          SRMHive is the premier collaboration platform for SRM students — post ideas,
          find skilled teammates, apply to exciting projects, and build your network.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
          <Link
            to="/browse-projects"
            className="btn-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[15px] rounded-2xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Explore Projects
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold text-[15px] rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 shadow-sm transition-all"
          >
            Join the Community
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 inline-flex items-center gap-10 px-8 py-5 glass rounded-2xl shadow-lg animate-fade-up delay-300">
          {stats.map((s, i) => (
            <div key={i} className={`text-center ${i < stats.length - 1 ? "pr-10 border-r border-slate-200" : ""}`}>
              <p className="font-display text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-slate-500 text-sm font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How it works ── */}
    <section className="relative px-4 pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3 block">
            How It Works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Three steps to your{" "}
            <span className="gradient-text">dream team</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div key={i} className={`card-premium p-8 relative group animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                {/* step number */}
                <div className="absolute top-6 right-6 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                  {i + 1}
                </div>
                {/* icon */}
                <div className={`w-14 h-14 ${c.bg} ring-4 ${c.ring} ${c.icon} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                {/* bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${c.badge} rounded-b-[20px] opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── CTA Banner ── */}
    <section className="px-4 pb-28">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 animate-gradient p-12 text-center shadow-2xl shadow-indigo-300/30">
          {/* noise overlay */}
          <div className="noise absolute inset-0 rounded-3xl" />
          {/* glow circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10">
            <h2 className="font-display text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to build something great?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of SRM students already collaborating on hackathons, startups, and research projects.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-indigo-700 font-bold text-[15px] rounded-2xl hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Get Started for Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>

  </div>
);

export default Home;