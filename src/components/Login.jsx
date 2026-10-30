
import { useState } from "react";

function Login({ onSubmit, onClose, onRegisterClick, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    onSubmit({ email: email.trim(), password });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[2px] text-blue-600">
              WELCOME TO RENTGRID
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Customer Login
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Log in to book a vehicle and view your bookings.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close login"
            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600"
          >
            ✕
          </button>
        </div>

        <label
          htmlFor="login-email"
          className="mt-6 block text-sm font-semibold text-slate-700"
        >
          Email Address
        </label>

        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />

        <label
          htmlFor="login-password"
          className="mt-4 block text-sm font-semibold text-slate-700"
        >
          Password
        </label>

        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            disabled={loading}
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
