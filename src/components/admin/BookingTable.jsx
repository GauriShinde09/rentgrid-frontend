
import BookingStatusBadge from "./BookingStatusBadge";

function BookingTable({ bookings, onConfirm, onReject, actionLoading }) {
  function getValue(value, fallback = "—") {
    return value === null || value === undefined || value === ""
      ? fallback
      : value;
  }

  function getCustomer(booking) {
    return booking.customerName ||
      booking.customer?.name ||
      booking.customer?.fullName ||
      booking.user?.name ||
      booking.user?.email ||
      "—";
  }

  function getVehicle(booking) {
    return booking.vehicleName ||
      booking.vehicle?.name ||
      booking.vehicle?.model ||
      "—";
  }

  function getDate(booking, ...keys) {
    const value = keys.map((key) => booking[key]).find(Boolean);
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("en-IN");
  }

  function getAmount(booking) {
    const amount = booking.totalAmount ??
      booking.totalPrice ??
      booking.totalCost ??
      booking.amount;

    return amount === undefined || amount === null
      ? "—"
      : `₹${Number(amount).toLocaleString("en-IN")}`;
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-lg font-bold">No bookings found</p>
        <p className="mt-2 text-sm text-slate-500">
          Customer bookings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4">Booking ID</th>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Vehicle</th>
            <th className="px-5 py-4">Pickup</th>
            <th className="px-5 py-4">Return</th>
            <th className="px-5 py-4">Amount</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => {
            const id = booking.id ?? booking.bookingId;
            const status = String(booking.status || "PENDING").toUpperCase();
            const pending = status === "PENDING";
            const loading = actionLoading === id;

            return (
              <tr key={id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-semibold">
                  #{getValue(id)}
                </td>
                <td className="px-5 py-4">{getCustomer(booking)}</td>
                <td className="px-5 py-4">{getVehicle(booking)}</td>
                <td className="px-5 py-4">
                  {getDate(booking, "pickupDate", "startDate", "startTime")}
                </td>
                <td className="px-5 py-4">
                  {getDate(booking, "returnDate", "endDate", "endTime")}
                </td>
                <td className="px-5 py-4 font-semibold">
                  {getAmount(booking)}
                </td>
                <td className="px-5 py-4">
                  <BookingStatusBadge status={status} />
                </td>
                <td className="px-5 py-4">
                  {pending ? (
                    <div className="flex gap-2">
                      <button
                        disabled={loading}
                        onClick={() => onConfirm(booking)}
                        className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? "Please wait..." : "Confirm"}
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => onReject(booking)}
                        className="rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400">No actions</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;
