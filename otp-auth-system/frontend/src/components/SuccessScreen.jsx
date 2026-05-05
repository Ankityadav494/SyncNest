// ──────────────────────────────────────────────────────────────
// components/SuccessScreen.jsx – Post-login success view
// ──────────────────────────────────────────────────────────────

export default function SuccessScreen({ user, onLogout }) {
  return (
    <div className="success-screen">
      <div className="success-icon">✓</div>

      <h2>Login Successful!</h2>
      <p>
        Your email has been verified and you are now
        <br />
        securely authenticated.
      </p>

      <div className="user-info">
        <p>Logged in as</p>
        <p className="email">{user?.email}</p>
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
          Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}
        </p>
      </div>

      <div style={{ marginTop: 28 }}>
        <button className="btn btn-secondary" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
