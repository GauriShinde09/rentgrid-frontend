
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function CustomerSupport() {
  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load customer's support requests
  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/rentgrid/support/my-requests"
      );

      setRequests(response.data || []);
    } catch (err) {
      console.error("Could not load support requests:", err);
      setError(
        err.response?.data?.message ||
          "Could not load support requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  // Handle form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // Submit support request
  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/rentgrid/support", formData);

      setFormData({
        subject: "",
        message: "",
      });

      setSuccess("Your support request was submitted successfully!");

      // Refresh request list
      await loadRequests();
    } catch (err) {
      console.error("Could not submit support request:", err);

      setError(
        err.response?.data?.message ||
          "Could not submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Status color
  function getStatusStyle(status) {
    if (status === "RESOLVED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "IN_PROGRESS") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <section>
      <div>
        <p className="text-xs font-bold tracking-widest text-blue-600">
          CUSTOMER SUPPORT
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          How can we help you?
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Submit your issue and track your support requests.
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Support form */}
      <div className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900">
          Create a Support Request
        </h3>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="support-subject"
              className="text-sm font-semibold text-slate-700"
            >
              Subject
            </label>

            <input
              id="support-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Enter your issue subject"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="support-message"
              className="text-sm font-semibold text-slate-700"
            >
              Describe your issue
            </label>

            <textarea
              id="support-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              maxLength={2000}
              placeholder="Explain your issue here..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* Previous requests */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900">
          My Support Requests
        </h3>

        {loading ? (
          <p className="mt-5 text-slate-500">
            Loading your requests...
          </p>
        ) : requests.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-semibold text-slate-700">
              No support requests yet.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Your submitted requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="font-bold text-slate-900">
                    {request.subject}
                  </h4>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {request.status?.replace("_", " ")}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {request.message}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  Submitted:{" "}
                  {request.createdAt
                    ? new Date(request.createdAt).toLocaleString()
                    : "Date unavailable"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerSupport;
