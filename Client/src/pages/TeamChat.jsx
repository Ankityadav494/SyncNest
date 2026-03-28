import socket from "../socket";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: "#6366f1", fg: "#fff" }, // indigo
  { bg: "#8b5cf6", fg: "#fff" }, // violet
  { bg: "#ec4899", fg: "#fff" }, // pink
  { bg: "#f59e0b", fg: "#fff" }, // amber
  { bg: "#10b981", fg: "#fff" }, // emerald
  { bg: "#3b82f6", fg: "#fff" }, // blue
  { bg: "#ef4444", fg: "#fff" }, // red
  { bg: "#14b8a6", fg: "#fff" }, // teal
];

const getColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const Avatar = ({ name = "", size = 36 }) => {
  const c = getColor(name);
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none"
      style={{ width: size, height: size, background: c.bg, color: c.fg, fontSize: size * 0.38 }}
    >
      {initials(name) || "?"}
    </div>
  );
};

const formatDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
};

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// safe cross-type ID comparison
const sameId = (a, b) => {
  if (!a || !b) return false;
  const aStr = (a?._id ?? a)?.toString?.() ?? "";
  const bStr = (b?._id ?? b)?.toString?.() ?? "";
  return aStr !== "" && aStr === bStr;
};

// ─── Component ─────────────────────────────────────────────────────────────────

const TeamChat = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showTeam, setShowTeam] = useState(false);

  // ── Fetch on mount ──
  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, histRes, appsRes] = await Promise.all([
          API.get(`/projects/${projectId}`),
          API.get(`/messages/project/${projectId}`),
          API.get(`/applications/me`),
        ]);
        setProject(projRes.data);
        setMessages(histRes.data);

        const accepted = appsRes.data.filter(
          (a) => sameId(a.project, projectId) && a.status === "Accepted"
        );
        setMembers(accepted.map((a) => a.applicant).filter(Boolean));

        const isOwner = sameId(projRes.data.owner, user);
        const isMember = accepted.some(() => true);
        setAllowed(isOwner || isMember);
      } catch {
        setError("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  // ── Socket ──
  useEffect(() => {
    if (!projectId) return;
    socket.emit("joinProject", projectId);
    const onMsg = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("receiveMessage", onMsg);
    return () => socket.off("receiveMessage", onMsg);
  }, [projectId]);

  // ── Auto-scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ──
  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      const t = text.trim();
      if (!t || sending) return;
      setSending(true);
      try {
        const res = await API.post(`/messages/project/${projectId}`, { text: t });
        socket.emit("sendMessage", { projectId, message: res.data });
        setMessages((prev) => [...prev, res.data]);
        setText("");
        inputRef.current?.focus();
      } catch {
        alert("Could not send. Try again.");
      } finally {
        setSending(false);
      }
    },
    [text, projectId, sending]
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
  };

  // ── States ──
  if (loading) return (
    <div className="flex justify-center items-center min-h-[70vh] mesh-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading team chat…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-[70vh] mesh-bg px-4">
      <div className="card-premium p-8 max-w-sm w-full text-center">
        <p className="text-lg font-bold text-red-500 mb-2">{error}</p>
        <Link to="/dashboard" className="text-sm text-indigo-600 underline underline-offset-2">← Dashboard</Link>
      </div>
    </div>
  );

  if (!project) return (
    <div className="flex justify-center items-center min-h-[70vh] mesh-bg">
      <div className="card-premium p-8 text-center">
        <p className="text-xl font-bold text-slate-800">Project Not Found</p>
      </div>
    </div>
  );

  if (!allowed) return <Navigate to="/dashboard" />;

  // ── Group by date ──
  const grouped = [];
  let lastDate = null;
  for (const m of messages) {
    const dl = formatDate(m.createdAt);
    if (dl !== lastDate) { grouped.push({ type: "date", label: dl }); lastDate = dl; }
    grouped.push({ type: "msg", data: m });
  }

  const myId = (user?._id ?? user?.id ?? "").toString();
  const ownerName = project.owner?.name ?? "Owner";

  return (
    <div className="h-[calc(100vh-64px)] mesh-bg py-3 px-3 sm:px-6 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full card-premium overflow-hidden" style={{ borderRadius: 24 }}>

        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-5 py-4 flex items-center justify-between shrink-0 overflow-hidden">
          <div className="noise absolute inset-0" />
          <div className="relative flex items-center gap-3 z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-extrabold text-white leading-tight font-display">{project.title}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)]" />
                <span className="text-xs text-indigo-100 font-medium">
                  {members.length + 1} member{members.length !== 0 ? "s" : ""} · Private
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={() => setShowTeam(v => !v)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-white text-xs font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Team
            </button>
            <Link
              to="/my-posts"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-white text-xs font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>

        {/* ── Team panel ── */}
        {showTeam && (
          <div className="bg-indigo-50/80 border-b border-indigo-100 px-5 py-3 flex flex-wrap gap-2.5 shrink-0 animate-fade-in">
            {[{ name: ownerName, role: "Owner", badge: "🛡️" }, ...members.map(m => ({ name: m.name, role: "Member", badge: "⭐" }))].map((m, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                <Avatar name={m.name} size={28} />
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">{m.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.badge} {m.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Messages ── */}
        <div
          className="flex-grow overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-1"
          style={{
            background: "linear-gradient(180deg, #f8faff 0%, #f1f5f9 100%)",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.03) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        >
          {grouped.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-16 animate-fade-up">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-700 mb-1">No messages yet</h3>
              <p className="text-slate-400 text-sm max-w-xs">Be the first to say hello to your team!</p>
            </div>
          ) : (
            grouped.map((item, idx) => {
              if (item.type === "date") return (
                <div key={`d-${idx}`} className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              );

              const msg = item.data;
              // Robust sender resolution
              const senderId = (msg.sender?._id ?? msg.sender)?.toString?.() ?? "";
              const isMine = senderId !== "" && myId !== "" && senderId === myId;
              const senderName = msg.sender?.name || (isMine ? user?.name : "Unknown");

              // Group adjacent messages from same sender
              const prev = grouped[idx - 1];
              const prevSenderId = prev?.type === "msg"
                ? (prev.data.sender?._id ?? prev.data.sender)?.toString?.() ?? ""
                : "";
              const grouped_ = prevSenderId === senderId;

              const isOwnerMsg = !isMine && sameId(msg.sender, project.owner);

              return (
                <div
                  key={msg._id ?? idx}
                  className={`flex items-end gap-2.5 animate-fade-in ${isMine ? "flex-row-reverse" : "flex-row"} ${grouped_ ? "mt-0.5" : "mt-4"}`}
                >
                  {/* Avatar */}
                  <div className="w-9 flex-shrink-0 mb-0.5">
                    {!grouped_ ? <Avatar name={senderName} size={34} /> : <div className="w-9" />}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col max-w-[66%] sm:max-w-[55%] ${isMine ? "items-end" : "items-start"}`}>
                    {/* Name row */}
                    {!grouped_ && (
                      <div className={`flex items-center gap-1.5 mb-1.5 ${isMine ? "flex-row-reverse" : ""}`}>
                        <span className={`text-[11px] font-bold ${isMine ? "text-indigo-600" : "text-slate-600"}`}>
                          {isMine ? "You" : senderName}
                        </span>
                        {isMine && (
                          <span className="text-[9px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded-full leading-none">
                            ME
                          </span>
                        )}
                        {isOwnerMsg && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full leading-none">
                            OWNER
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words ${
                        isMine
                          ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl rounded-br-sm shadow-indigo-200"
                          : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm"
                      }`}
                      style={{ maxWidth: "100%", wordBreak: "break-word" }}
                    >
                      {msg.text}
                    </div>

                    {/* Timestamp */}
                    <div className={`flex items-center gap-1 mt-1 ${isMine ? "flex-row-reverse" : ""}`}>
                      <span className="text-[10px] text-slate-400">{fmtTime(msg.createdAt)}</span>
                      {isMine && <span className="text-[10px] text-indigo-400">✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div className="px-4 sm:px-5 py-3.5 bg-white border-t border-slate-100 shrink-0">
          {/* "Chatting as" strip */}
          <div className="flex items-center gap-2 mb-2.5">
            <Avatar name={user?.name ?? ""} size={22} />
            <span className="text-xs text-slate-400 font-medium">
              Chatting as{" "}
              <span className="font-bold text-slate-700">{user?.name}</span>
            </span>
            <span className="ml-auto text-[10px] text-slate-300 font-medium hidden sm:block">
              Press Enter to send
            </span>
          </div>

          <form onSubmit={handleSend} className="flex gap-2.5">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              className="input-ring flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] text-slate-800 placeholder-slate-400 transition-all"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className={`btn-glow flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white transition-all ${
                text.trim() && !sending
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {sending
                ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : <>
                    <span className="hidden sm:inline">Send</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </>
              }
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TeamChat;