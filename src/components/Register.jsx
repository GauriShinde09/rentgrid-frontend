
import { useState } from "react";
import api from "../api/axiosConfig";

function Register({ onBackToLogin, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/rentgrid/users/register", formData);

      setMessage("Account created successfully! Please log in.");

      setTimeout(() => {
        onBackToLogin();
      }, 1200);
    } catch (err) {
      console.error("Registration failed:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="my-auto w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[2px] text-blue-600">
              JOIN RENTGRID
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your account to start booking vehicles.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close registration"
            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600"
          >
            ✕
          </button>
        </div>

        <label
          htmlFor="register-name"
          className="mt-5 block text-sm font-semibold text-slate-700"
        >
          Full Name
        </label>

        <input
          id="register-name"
          type="text"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />

        <label
          htmlFor="register-email"
          className="mt-4 block text-sm font-semibold text-slate-700"
        >
          Email Address
        </label>

        <input
          id="register-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={150}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />

        <label
          htmlFor="register-phone"
          className="mt-4 block text-sm font-semibold text-slate-700"
        >
          Phone Number
        </label>

        <input
          id="register-phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          maxLength={15}
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />

        <label
          htmlFor="register-password"
          className="mt-4 block text-sm font-semibold text-slate-700"
        >
          Password
        </label>

        <input
          id="register-password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password (minimum 8 characters)"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-3 text-sm text-green-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account →"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            disabled={loading}
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
