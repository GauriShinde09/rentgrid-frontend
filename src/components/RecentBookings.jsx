
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function RecentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/rentgrid/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(response.data) ? response.data : [];

      // Show the latest bookings first
      setBookings(
        data
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Recent bookings error:", error);
      setError(
        error.response?.status === 403
          ? "Admin access is required to view bookings."
          : "Unable to load recent bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function statusStyle(status) {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[2px] text-blue-600">
            BOOKING MANAGEMENT
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">
            Recent Bookings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The five most recent bookings.
          </p>
        </div>

        <button
          onClick={loadBookings}
          disabled={loading}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-slate-500">
          Loading recent bookings...
        </p>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            onClick={loadBookings}
            className="mt-3 font-bold underline"
          >
            Try again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-8 text-center">
          <p className="text-lg font-bold text-slate-700">
            No bookings yet
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Customer bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-4">Booking</th>
                <th className="px-3 py-4">Vehicle</th>
                <th className="px-3 py-4">Pickup</th>
                <th className="px-3 py-4">Return</th>
                <th className="px-3 py-4">Amount</th>
                <th className="px-3 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-slate-50 transition hover:bg-slate-50"
                >
                  <td className="px-3 py-4 font-bold text-slate-800">
                    #{booking.id}
                  </td>

                  <td className="px-3 py-4 font-medium text-slate-700">
                    {booking.vehicleName || `Vehicle #${booking.vehicleId}`}
                  </td>

                  <td className="px-3 py-4 text-sm text-slate-600">
                    {formatDate(booking.pickupDate)}
                  </td>

                  <td className="px-3 py-4 text-sm text-slate-600">
                    {formatDate(booking.returnDate)}
                  </td>

                  <td className="px-3 py-4 font-bold text-slate-800">
                    ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentBookings;
