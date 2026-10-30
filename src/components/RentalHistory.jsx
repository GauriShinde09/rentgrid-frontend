
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function RentalHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRentalHistory() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/rentgrid/bookings/history");
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Could not load rental history:", err);

      setError(
        err.response?.data?.message ||
          "Could not load rental history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRentalHistory();
  }, []);

  const money = (amount) =>
    "₹" + Number(amount || 0).toLocaleString("en-IN");

  return (
    <section>
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold">Loading rental history...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-red-700">{error}</p>

          <button
            onClick={loadRentalHistory}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="text-5xl">🛣️</div>

          <h3 className="mt-4 text-xl font-bold">
            No completed rentals yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Your completed trips will appear here.
          </p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">
                    {booking.vehicleName ||
                      `Vehicle #${booking.vehicleId ?? "—"}`}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Booking ID: {booking.id}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                  {booking.status || "COMPLETED"}
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
                  <p className="text-slate-500">Total amount</p>
                  <p className="mt-1 text-lg font-extrabold">
                    {money(booking.totalAmount)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RentalHistory;



