
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import BookingTable from "./BookingTable";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Custom confirmation popup states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  // Load all bookings
  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/rentgrid/bookings");

      setBookings(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Could not load bookings:", err);

      setError(
        err.response?.data?.message ||
          (err.response?.status === 403
            ? "Only an admin can view all bookings."
            : "Could not load bookings. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  // Open custom confirmation popup
  function openConfirmation(booking, action) {
    setSelectedBooking(booking);
    setSelectedAction(action);
    setNotice("");
    setError("");
  }

  // Close custom confirmation popup
  function closeConfirmation() {
    if (actionLoading !== null) return;

    setSelectedBooking(null);
    setSelectedAction("");
  }

  // Confirm or reject a booking
  async function updateBooking(booking, action) {
    const id = booking.id ?? booking.bookingId;

    if (id === null || id === undefined) {
      setError("Booking ID was not found.");
      return;
    }

    setActionLoading(id);
    setNotice("");
    setError("");

    try {
      await api.put(`/rentgrid/bookings/${id}/${action}`);

      setNotice(
        action === "confirm"
          ? `Booking #${id} confirmed successfully!`
          : `Booking #${id} rejected successfully!`
      );

      await loadBookings();
    } catch (err) {
      console.error(`Could not ${action} booking:`, err);

      setError(
        err.response?.data?.message ||
          (err.response?.status === 403
            ? "Only an admin can update bookings."
            : `Could not ${action} booking. Please try again.`)
      );
    } finally {
      setActionLoading(null);
    }
  }

  // Execute action only after popup confirmation
  async function handleConfirmAction() {
    if (!selectedBooking || !selectedAction) return;

    const booking = selectedBooking;
    const action = selectedAction;

    setSelectedBooking(null);
    setSelectedAction("");

    await updateBooking(booking, action);
  }

  const pendingCount = bookings.filter(
    (booking) =>
      String(booking.status || "PENDING").toUpperCase() ===
      "PENDING"
  ).length;

  return (
    <section>
      {/* Page heading */}
     <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-xs font-bold tracking-[2px] text-blue-600">
      RENTGRID · ADMINISTRATION
    </p>

    <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
      Booking Overview
    </h2>

    <p className="mt-2 text-sm text-slate-500">
      Review customer reservations and manage booking requests.
    </p>
  </div>


        <button
          type="button"
          onClick={loadBookings}
          disabled={loading}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Booking statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Bookings</p>

          <p className="mt-2 text-3xl font-extrabold">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800">
            Pending Bookings
          </p>

          <p className="mt-2 text-3xl font-extrabold text-amber-900">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Success message */}
      {notice && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
        >
          ✓ {notice}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}

          <button
            type="button"
            onClick={loadBookings}
            className="ml-3 font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Booking table */}
      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
          Loading bookings...
        </div>
      ) : !error ? (
        <BookingTable
          bookings={bookings}
          actionLoading={actionLoading}
          onConfirm={(booking) =>
            openConfirmation(booking, "confirm")
          }
          onReject={(booking) =>
            openConfirmation(booking, "reject")
          }
        />
      ) : null}

      {/* Custom confirmation popup */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirmation();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirm-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            {/* Icon */}
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
                selectedAction === "confirm"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedAction === "confirm" ? "✓" : "!"}
            </div>

            {/* Heading */}
            <h3
              id="booking-confirm-title"
              className="mt-5 text-center text-xl font-extrabold text-slate-900"
            >
              {selectedAction === "confirm"
                ? "Confirm Booking?"
                : "Reject Booking?"}
            </h3>

            {/* Description */}
            <p className="mt-3 text-center text-sm leading-6 text-slate-600">
              {selectedAction === "confirm"
                ? "Are you sure you want to confirm this booking?"
                : "Are you sure you want to reject this booking?"}
            </p>

            {/* Booking ID */}
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Booking ID
              </p>

              <p className="mt-1 text-lg font-extrabold text-slate-900">
                #
                {selectedBooking.id ??
                  selectedBooking.bookingId}
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeConfirmation}
                disabled={actionLoading !== null}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={actionLoading !== null}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  selectedAction === "confirm"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {selectedAction === "confirm"
                  ? "Yes, Confirm"
                  : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ManageBookings;
