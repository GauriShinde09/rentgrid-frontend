
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Get token for admin authentication
  function authConfig() {
    const token = localStorage.getItem("token");

    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  }

  // Load all bookings
  async function loadBookings() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(
        "/rentgrid/bookings",
        authConfig()
      );

      setBookings(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Could not load bookings:", err);

      setError(
        err.response?.status === 401 ||
          err.response?.status === 403
          ? "Admin access denied. Please log in with an admin account."
          : "Could not load bookings. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // Load bookings when the component opens
  useEffect(() => {
    loadBookings();
  }, []);

  // Confirm or reject a booking
  async function updateBooking(id, action) {
    setUpdatingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(
        `/rentgrid/bookings/${id}/${action}`,
        {},
        authConfig()
      );

      // Update the booking in the list
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === id ? response.data : booking
        )
      );

      // Show success message
      setSuccess(
        action === "confirm"
          ? `Booking #${id} confirmed successfully!`
          : `Booking #${id} rejected successfully!`
      );
    } catch (err) {
      console.error(`Could not ${action} booking:`, err);

      setError(
        err.response?.status === 401 ||
          err.response?.status === 403
          ? "Admin access denied. Please log in with an admin account."
          : err.response?.data?.message ||
            `Could not ${action} this booking. Please try again.`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // Format amount in Indian currency
  function formatMoney(amount) {
    return (
      "₹" +
      Number(amount || 0).toLocaleString("en-IN")
    );
  }

  // Loading message
  if (loading) {
    return (
      <p className="rounded-xl bg-white p-6 text-slate-600">
        Loading bookings...
      </p>
    );
  }

  return (
    <section>
      {/* Page heading and refresh button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-blue-600">
            ADMIN PANEL
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View, confirm, or reject customer bookings.
          </p>
        </div>

        <button
          onClick={loadBookings}
          disabled={loading}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* Error notification */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Success notification */}
      {success && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700"
        >
          {success}
        </p>
      )}

      {/* No bookings message */}
      {!error && bookings.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-500">
          <p className="text-lg font-semibold">
            No bookings found
          </p>

          <p className="mt-1 text-sm">
            Customer bookings will appear here.
          </p>
        </div>
      )}

      {/* Booking cards */}
      <div className="mt-6 grid gap-4">
        {bookings.map((booking) => {
          const status = String(
            booking.status || ""
          ).toUpperCase();

          return (
            <article
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {/* Booking details and status */}
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {booking.vehicleName ||
                      `Vehicle #${booking.vehicleId}`}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Booking ID: {booking.id} · Customer ID:{" "}
                    {booking.userId ?? "N/A"}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1 text-sm font-semibold ${
                    status === "CONFIRMED"
                      ? "bg-green-50 text-green-700"
                      : status === "REJECTED"
                      ? "bg-red-50 text-red-700"
                      : status === "PENDING"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {status || "UNKNOWN"}
                </span>
              </div>

              {/* Pickup, return and amount */}
              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-slate-500">
                    Pickup Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {booking.pickupDate || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Return Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {booking.returnDate || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Total Amount
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formatMoney(booking.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Confirm and reject buttons */}
              {status === "PENDING" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    disabled={updatingId === booking.id}
                    onClick={() =>
                      updateBooking(booking.id, "confirm")
                    }
                    className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === booking.id
                      ? "Updating..."
                      : "Confirm Booking"}
                  </button>

                  <button
                    disabled={updatingId === booking.id}
                    onClick={() =>
                      updateBooking(booking.id, "reject")
                    }
                    className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === booking.id
                      ? "Updating..."
                      : "Reject Booking"}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdminBookings;
