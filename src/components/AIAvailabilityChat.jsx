
import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  CarFront,
  Eye,
  CalendarCheck,
} from "lucide-react";
import api from "../api/axiosConfig";

function AIAvailabilityChat({ onViewDetails, onBook }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setVehicles([]);
    setHasSearched(false);

    try {
      const response = await api.post("/rentgrid/ai/availability", {
        message: message.trim(),
      });

      setVehicles(Array.isArray(response.data) ? response.data : []);
      setHasSearched(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to find vehicles right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vehicle) => {
    if (onViewDetails) {
      onViewDetails(vehicle);
      setIsOpen(false);
    }
  };

  const handleBookNow = (vehicle) => {
    if (vehicle.status !== "AVAILABLE") {
      return;
    }

    if (onBook) {
      onBook(vehicle);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating AI button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white shadow-xl transition hover:scale-105"
        >
          <MessageCircle size={22} />
          <span className="font-semibold">AI Vehicle Finder</span>
        </button>
      )}

      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(680px,85vh)] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-700 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Bot size={24} />
              </div>

              <div>
                <h2 className="font-bold">RentGrid AI Assistant</h2>
                <p className="text-xs text-blue-100">
                  Find a vehicle that suits you
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
              className="rounded-full p-2 transition hover:bg-white/20"
            >
              <X size={22} />
            </button>
          </div>

          {/* Chat content */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm text-slate-700 shadow-sm">
              Hi! 👋 Tell me your preferred vehicle type, travel dates,
              number of passengers, and daily budget. I'll find matching
              vehicles for you.
            </div>

            {/* Suggested prompts */}
            <div className="flex flex-wrap gap-2">
              {[
                "I need an SUV for 5 people under 3000 per day",
                "Find a sedan for a family trip",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setMessage(suggestion)}
                  className="rounded-full border border-blue-200 bg-white px-3 py-2 text-left text-xs text-blue-700 transition hover:bg-blue-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                Searching for matching vehicles...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* No results */}
            {hasSearched && !loading && vehicles.length === 0 && !error && (
              <div className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                Sorry, no vehicles match your requirements. Try increasing
                your daily budget or changing your vehicle preferences.
              </div>
            )}

            {/* Matching vehicles */}
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                    <CarFront size={28} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800">
                      {vehicle.name || vehicle.model}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {vehicle.brand} · {vehicle.vehicleType}
                    </p>
                  </div>
                </div>

                <p className="mb-3 text-sm text-slate-600">
                  {vehicle.description}
                </p>

                {/* Vehicle information */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Price per day</p>
                    <p className="font-bold text-blue-700">
                      ₹{Number(vehicle.pricePerDay).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Seats</p>
                    <p className="font-semibold text-slate-800">
                      {vehicle.seatingCapacity} people
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Fuel</p>
                    <p className="font-semibold text-slate-800">
                      {vehicle.fuelType}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Transmission</p>
                    <p className="font-semibold text-slate-800">
                      {vehicle.transmission}
                    </p>
                  </div>
                </div>

                {/* Availability status */}
                <div className="mt-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      vehicle.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {vehicle.status || "STATUS UNKNOWN"}
                  </span>
                </div>

                {/* View Details and Book Now */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(vehicle)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    <Eye size={17} />
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBookNow(vehicle)}
                    disabled={vehicle.status !== "AVAILABLE"}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <CalendarCheck size={17} />
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSearch}
            className="flex items-end gap-2 border-t border-slate-200 bg-white p-3"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Describe your vehicle requirements..."
              rows={2}
              className="max-h-28 min-w-0 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Search vehicles"
              className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={19} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIAvailabilityChat;
