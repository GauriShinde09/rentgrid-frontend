
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function AdminSupport() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all customer support requests
  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/rentgrid/admin/support");
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

  // Update support request status
  async function handleStatusChange(requestId, newStatus) {
    setError("");

    try {
      const response = await api.put(
        `/rentgrid/admin/support/${requestId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
        }
      );

      console.log("Status updated:", response.data);

      await loadRequests();
    } catch (err) {
      console.error("Status update error:", err);
      console.error("Response data:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Could not update request status."
      );
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <section>
      <p className="text-xs font-bold tracking-widest text-blue-600">
        ADMIN MANAGEMENT
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Support Requests
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        View and manage customer support requests.
      </p>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-slate-500">
          Loading support requests...
        </p>
      ) : requests.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold text-slate-700">
            No support requests found.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {request.subject}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Customer: {request.customerName}
                  </p>

                  <p className="text-sm text-slate-500">
                    Email: {request.customerEmail}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  {request.status?.replace("_", " ")}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  {request.message}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Submitted:{" "}
                  {request.createdAt
                    ? new Date(request.createdAt).toLocaleString()
                    : "Date unavailable"}
                </p>

                <select
                  value={request.status}
                  onChange={(event) =>
                    handleStatusChange(
                      request.id,
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminSupport;
