import { useState } from "react";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function BookingModal({ vehicle, onClose, onSubmit, loading }) {
  const today = getToday();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [dateError, setDateError] = useState("");

  if (!vehicle) return null;

  function handleSubmit(event) {
    event.preventDefault();
    setDateError("");

    if (!pickupDate || !returnDate) {
      setDateError("Please select both pickup and return dates.");
      return;
    }

    if (returnDate <= pickupDate) {
      setDateError("Return date must be after the pickup date.");
      return;
    }

    // These are the exact fields required by BookingRequestDto.
    onSubmit({
      vehicleId: vehicle.id,
      pickupDate,
      returnDate,
    });
  }

  const duration = pickupDate && returnDate && returnDate > pickupDate
    ? Math.round((new Date(`${returnDate}T12:00:00`) - new Date(`${pickupDate}T12:00:00`)) / 86400000)
    : 0;

  const money = (amount) => "₹" + Number(amount || 0).toLocaleString("en-IN");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-600">RENTGRID RESERVATION</p>
            <h2 id="booking-title" className="mt-2 text-2xl font-extrabold">Book your ride</h2>
          </div>
          <button type="button" onClick={onClose} disabled={loading} aria-label="Close booking" className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600 disabled:opacity-50">
            ✕
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-slate-50 p-3">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-20 w-28 rounded-xl object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "https://placehold.co/400x240/eaf0f8/334155?text=Vehicle";
            }}
          />
          <div>
            <h3 className="font-bold">{vehicle.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{vehicle.type} · {vehicle.seats} seats</p>
            <p className="mt-1 font-bold text-blue-700">{money(vehicle.price)} / day</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pickup-date" className="mb-2 block text-sm font-semibold">Pickup date</label>
            <input
              id="pickup-date"
              type="date"
              min={today}
              value={pickupDate}
              required
              onChange={(event) => {
                const value = event.target.value;
                setPickupDate(value);
                setDateError("");
                if (returnDate && value >= returnDate) setReturnDate("");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="return-date" className="mb-2 block text-sm font-semibold">Return date</label>
            <input
              id="return-date"
              type="date"
              min={pickupDate ? (pickupDate >= today ? pickupDate : today) : today}
              value={returnDate}
              required
              onChange={(event) => {
                setReturnDate(event.target.value);
                setDateError("");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {dateError && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{dateError}</p>}

        <div className="mt-6 rounded-2xl bg-blue-50 p-4">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Rental duration</span>
            <span>{duration > 0 ? `${duration} day(s)` : "Select valid dates"}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-semibold">Estimated total</span>
            <span className="text-2xl font-extrabold text-blue-700">{money(vehicle.price * (duration || 0))}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">The final amount is calculated by the server.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating booking..." : "Confirm booking →"}
        </button>
      </form>
    </div>
  );
}

export default BookingModal;
