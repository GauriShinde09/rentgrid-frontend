
import { useState } from "react";
import api from "../api/axiosConfig";

function MyBookings({
  bookings,
  loading,
  error,
  onRetry,
  onExplore,
  onCancel,
  cancellingBookingId,
}) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [invoice, setInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);

  const money = (amount) =>
    "₹" +
    Number(amount ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  function canCancel(status) {
    const currentStatus = String(status || "PENDING").toUpperCase();
    return currentStatus === "PENDING" || currentStatus === "CONFIRMED";
  }

  async function confirmCancellation() {
    if (!selectedBooking) return;

    const booking = selectedBooking;
    setSelectedBooking(null);
    await onCancel(booking);
  }

  // Fetch invoice for a completed booking
  async function handleViewInvoice(bookingId) {
    setShowInvoice(true);
    setInvoice(null);
    setInvoiceError("");
    setInvoiceLoading(true);

    try {
      const response = await api.get(
        `/rentgrid/invoices/booking/${bookingId}`
      );

      setInvoice(response.data);
    } catch (error) {
      console.error("Invoice error:", error);

      setInvoiceError(
        error.response?.data?.message ||
          "Unable to load this invoice. Please try again."
      );
    } finally {
      setInvoiceLoading(false);
    }
  }

  function closeInvoice() {
    setShowInvoice(false);
    setInvoice(null);
    setInvoiceError("");
  }

  return (
    <section>
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold">Loading your bookings...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <p className="font-semibold text-red-700">{error}</p>

          <button
            onClick={onRetry}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-12">
          <div className="text-5xl">🚘</div>

          <h3 className="mt-4 text-xl font-bold">No bookings yet</h3>

          <p className="mt-2 text-sm text-slate-500">
            Your bookings will appear here after you reserve a vehicle.
          </p>

          <button
            onClick={onExplore}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            Explore vehicles
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const bookingId = booking.id ?? booking.bookingId;
            const status = String(booking.status || "PENDING").toUpperCase();
            const isCancelling = cancellingBookingId === bookingId;

            return (
              <article
                key={bookingId}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      {booking.vehicleName ||
                        `Vehicle #${booking.vehicleId ?? "—"}`}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Booking ID: {bookingId}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      status === "CONFIRMED" || status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : status === "CANCELLED" || status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-slate-500">Pickup date</p>
                    <p className="mt-1 font-semibold">
                      {booking.pickupDate || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Return date</p>
                    <p className="mt-1 font-semibold">
                      {booking.returnDate || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Rental amount</p>
                    <p className="mt-1 text-lg font-extrabold">
                      {money(booking.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  {status === "COMPLETED" && (
                    <button
                      onClick={() => handleViewInvoice(bookingId)}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      View Invoice
                    </button>
                  )}

                  {canCancel(status) && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      disabled={isCancelling}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Invoice modal */}
      {showInvoice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
          onClick={closeInvoice}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-title"
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[2px] text-blue-600">
                  RENTGRID
                </p>

                <h2
                  id="invoice-title"
                  className="mt-2 text-2xl font-extrabold text-slate-900"
                >
                  Rental Invoice
                </h2>

                {invoice && (
                  <p className="mt-1 text-sm text-slate-500">
                    Invoice #{invoice.id} · Booking #{invoice.bookingId}
                  </p>
                )}
              </div>

              <button
                onClick={closeInvoice}
                aria-label="Close invoice"
                className="rounded-xl px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            {invoiceLoading && (
              <p className="py-10 text-center text-slate-500">
                Loading invoice...
              </p>
            )}

            {!invoiceLoading && invoiceError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{invoiceError}</p>

                <button
                  onClick={() =>
                    handleViewInvoice(
                      invoice?.bookingId ??
                        bookings.find(
                          (booking) =>
                            (booking.id ?? booking.bookingId) ===
                            invoice?.bookingId
                        )?.id
                    )
                  }
                  className="mt-3 text-sm font-bold text-blue-700 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!invoiceLoading && invoice && (
              <>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Invoice date</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {invoice.createdAt
                      ? new Date(invoice.createdAt).toLocaleDateString(
                          "en-IN"
                        )
                      : "—"}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Rental amount</span>
                    <span className="font-semibold">
                      {money(invoice.rentalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">
                      Extra-kilometre charges
                    </span>
                    <span className="font-semibold">
                      {money(invoice.extraKmCharge)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">
                      Late-return charges
                    </span>
                    <span className="font-semibold">
                      {money(invoice.lateReturnCharge)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Damage charges</span>
                    <span className="font-semibold">
                      {money(invoice.damageCharge)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-dashed border-slate-300 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-800">
                      Final Total
                    </span>

                    <span className="text-2xl font-extrabold text-blue-700">
                      {money(invoice.totalAmount)}
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Thank you for choosing RentGrid.
                </p>
              </>
            )}

            <button
              onClick={closeInvoice}
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {/* Cancellation confirmation modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>

            <h3
              id="cancel-booking-title"
              className="mt-4 text-center text-xl font-extrabold"
            >
              Cancel this booking?
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to cancel booking #
              {selectedBooking.id ?? selectedBooking.bookingId}? This action
              will send a cancellation request.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Booking
              </button>

              <button
                onClick={confirmCancellation}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyBookings;
