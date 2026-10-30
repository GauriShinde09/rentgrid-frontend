
import { useState } from "react";
import api from "../api/axiosConfig";

function ResetPassword({ onBackToLogin }) {
  const token = new URLSearchParams(window.location.search).get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Your reset link is missing its token. Please request a new link.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setError("Your password must be between 8 and 72 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Your passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(
        "/rentgrid/auth/reset-password",
        { token, newPassword }
      );

      setMessage(
        response.data?.message || "Your password has been reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "This reset link may have expired or already been used. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-950/10">

        {/* Left branding panel */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-24 top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-12 top-36 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-xl font-black shadow-lg shadow-blue-900/40">
                R
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                RentGrid<span className="text-blue-300">.</span>
              </span>
            </div>

            <div className="mt-24">
              <p className="text-xs font-bold uppercase tracking-[3px] text-blue-300">
                Your journey, your way
              </p>
              <h1 className="mt-5 max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
                A fresh start begins with a secure account.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-blue-100/80">
                Set a new password and get back to planning your next journey
                with RentGrid.
              </p>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                ♧
              </div>
              <div>
                <p className="font-semibold">Your security matters</p>
                <p className="mt-1 text-sm text-blue-100/70">
                  Use a password you haven't used before.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-12 lg:w-1/2 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">

            <div className="mb-10 lg:hidden">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                RentGrid<span className="text-blue-600">.</span>
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>
              </div>

              <p className="text-sm font-bold uppercase tracking-[2px] text-blue-600">
                Account recovery
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Reset password
              </h2>
              <p className="mt-3 leading-6 text-slate-500">
                Almost there! Create a new password to secure your RentGrid
                account.
              </p>
            </div>

            {message ? (
              <div>
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg text-green-700">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900">
                        Password updated!
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-green-800">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Continue to Login <span>→</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {!token && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    Your reset token is missing. Please open the complete
                    reset link from your email or request a new link.
                  </div>
                )}

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter your new password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Use between 8 and 72 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(event) => setShowPassword(event.target.checked)}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  Show passwords
                </label>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating password...
                    </>
                  ) : (
                    <>Reset Password <span>→</span></>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Your reset link expires after 15 minutes. If it expires,
                  request a new one.
                </p>
              </form>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-sm font-semibold text-slate-500 transition hover:text-blue-700"
              >
                ← Back to Login
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              © 2026 RentGrid · Your journey, your way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
