
import { useState } from "react";
import api from "../api/axiosConfig";

function AvailabilityNotification({
  vehicleId,
  pickupDate,
  returnDate,
  onClose,
  notify
}) {
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    try {
      setLoading(true);

      const response = await api.post(
        "/rentgrid/availability-notifications",
        {
          vehicleId: vehicleId,
          pickupDate: pickupDate,
          returnDate: returnDate
        }
      );

      notify(
        response.data.message ||
        "Your notification request has been saved successfully."
      );

      onClose();
    } catch (error) {
      console.error("Notification Error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to save notification request.";

      notify(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-800">
            Vehicle Already Booked
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-2 py-1 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close notification dialog"
          >
            &times;
          </button>
        </div>

        {/* Description */}
        <p className="mb-5 text-sm leading-6 text-slate-600">
          This vehicle is unavailable for your selected dates.
          Would you like to be notified when it becomes available?
        </p>

        {/* Selected dates */}
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
          <p>
            <strong className="text-slate-800">Pickup:</strong>{" "}
            {pickupDate}
          </p>

          <p className="mt-2">
            <strong className="text-slate-800">Return:</strong>{" "}
            {returnDate}
          </p>
        </div>

        {/* Notify button */}
        <button
          type="button"
          onClick={handleNotify}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving Request..." : "Notify Me When Available"}
        </button>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Maybe Later
        </button>

      </div>
    </div>
  );
}

export default AvailabilityNotification;
