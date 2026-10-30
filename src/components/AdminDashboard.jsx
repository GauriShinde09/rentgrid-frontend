
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import RecentBookings from "./RecentBookings";

function AdminDashboard() {
  const [bookingStats, setBookingStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all three report APIs
  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [bookingResponse, revenueResponse, vehicleResponse] =
        await Promise.all([
          api.get("/rentgrid/admin/reports/bookings"),
          api.get("/rentgrid/admin/reports/revenue"),
          api.get("/rentgrid/admin/reports/vehicles"),
        ]);

      setBookingStats(bookingResponse.data);
      setRevenue(revenueResponse.data);
      setVehicles(vehicleResponse.data);
    } catch (error) {
      console.error("Dashboard report error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard reports. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format amounts in Indian currency format
  const formatCurrency = (amount) => {
    return `₹${Number(amount ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  // Main statistics cards
  const cards = [
    {
      title: "Completed Bookings",
      value: bookingStats?.completedBookings ?? 0,
      icon: "✓",
      color: "green",
    },
    {
      title: "Total Revenue",
      value: revenue
        ? formatCurrency(revenue.totalRevenue)
        : "Loading...",
      icon: "₹",
      color: "blue",
    },
    {
      title: "Total Bookings",
      value: bookingStats?.totalBookings ?? 0,
      icon: "▤",
      color: "purple",
    },
    {
      title: "Active Bookings",
      value: bookingStats?.activeBookings ?? 0,
      icon: "↗",
      color: "orange",
    },
  ];

  // Booking status statistics
  const bookingStatuses = bookingStats
    ? [
        {
          name: "Confirmed",
          value: Number(bookingStats.confirmedBookings) || 0,
          color: "bg-green-500",
          text: "text-green-600",
        },
        {
          name: "Pending",
          value: Number(bookingStats.pendingBookings) || 0,
          color: "bg-amber-500",
          text: "text-amber-600",
        },
        {
          name: "Active",
          value: Number(bookingStats.activeBookings) || 0,
          color: "bg-blue-500",
          text: "text-blue-600",
        },
        {
          name: "Completed",
          value: Number(bookingStats.completedBookings) || 0,
          color: "bg-purple-500",
          text: "text-purple-600",
        },
        {
          name: "Rejected",
          value: Number(bookingStats.rejectedBookings) || 0,
          color: "bg-red-500",
          text: "text-red-600",
        },
        {
          name: "Cancelled",
          value: Number(bookingStats.cancelledBookings) || 0,
          color: "bg-slate-400",
          text: "text-slate-500",
        },
      ]
    : [];

  // Initial loading
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="font-semibold text-slate-700">
          Loading your dashboard...
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Fetching the latest RentGrid reports.
        </p>
      </div>
    );
  }

  // API error
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8">
        <h2 className="text-xl font-bold text-slate-800">
          Dashboard unavailable
        </h2>

        <p className="mt-2 text-sm text-red-600">{error}</p>

        <button
          onClick={loadDashboard}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-7 text-white shadow-lg sm:p-9">
        <div className="pointer-events-none absolute -right-5 -top-12 text-9xl font-black text-white/5 sm:text-[180px]">
          RG
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold tracking-[3px] text-blue-300">
              RENTGRID · ADMIN CONTROL CENTER
            </p>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Dashboard Overview
            </h2>

            <p className="mt-3 text-sm text-blue-100 sm:text-base">
              Manage your fleet and keep track of rental bookings.
            </p>

            <p className="mt-5 text-sm text-blue-200">
              📅 {today}
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="rounded-xl bg-white px-5 py-3 font-bold text-blue-700 shadow transition hover:bg-blue-50"
          >
            ↻ Refresh Data
          </button>
        </div>
      </section>

      {/* Key statistics */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-bold tracking-[2px] text-blue-600">
            YOUR BUSINESS AT A GLANCE
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            Key Statistics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live counts and revenue from your RentGrid database.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-3 break-words text-3xl font-extrabold text-slate-900">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                    card.color === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : card.color === "green"
                      ? "bg-green-100 text-green-700"
                      : card.color === "purple"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {card.icon}
                </div>
              </div>

              <div
                className={`mt-5 h-1 w-full rounded-full ${
                  card.color === "blue"
                    ? "bg-blue-500"
                    : card.color === "green"
                    ? "bg-green-500"
                    : card.color === "purple"
                    ? "bg-purple-500"
                    : "bg-orange-500"
                }`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Revenue breakdown */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold tracking-[2px] text-blue-600">
          FINANCIAL OVERVIEW
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          Revenue Breakdown
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Revenue collected across invoice charge categories.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Rental Revenue",
              value: revenue?.totalRentalRevenue,
              color: "text-blue-700 bg-blue-50",
            },
            {
              title: "Extra KM Charges",
              value: revenue?.totalExtraKmCharges,
              color: "text-purple-700 bg-purple-50",
            },
            {
              title: "Late Return Charges",
              value: revenue?.totalLateReturnCharges,
              color: "text-orange-700 bg-orange-50",
            },
            {
              title: "Damage Charges",
              value: revenue?.totalDamageCharges,
              color: "text-red-700 bg-red-50",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl p-5 ${item.color}`}
            >
              <p className="text-sm font-medium">{item.title}</p>
              <h3 className="mt-3 text-2xl font-extrabold">
                {formatCurrency(item.value)}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Booking status overview */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-bold tracking-[2px] text-blue-600">
            BOOKING INSIGHTS
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            Booking Status Overview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Distribution of bookings by their current status.
          </p>
        </div>

        {Number(bookingStats.totalBookings) === 0 ? (
          <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            No bookings available yet.
          </p>
        ) : (
          <div className="space-y-6">
            {bookingStatuses.map((item) => {
              const percentage =
                (item.value / Number(bookingStats.totalBookings)) * 100;

              return (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-700">
                      {item.name}
                    </span>

                    <span className={`text-sm font-bold ${item.text}`}>
                      {item.value} · {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-7 border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500">
            Total bookings recorded:{" "}
            <span className="font-bold text-slate-900">
              {bookingStats.totalBookings}
            </span>
          </p>
        </div>
      </section>

      {/* Vehicle performance */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold tracking-[2px] text-blue-600">
          FLEET INSIGHTS
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          Vehicle Performance
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Compare booking activity and rental revenue across your fleet.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-4 font-semibold">Vehicle</th>
                <th className="px-4 py-4 font-semibold">Total Bookings</th>
                <th className="px-4 py-4 font-semibold">Completed</th>
                <th className="px-4 py-4 font-semibold">Rental Revenue</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.vehicleId}
                  className="border-b border-slate-100 transition hover:bg-blue-50/50"
                >
                  <td className="px-4 py-4 font-semibold text-slate-800">
                    {vehicle.vehicleName}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {vehicle.totalBookings}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {vehicle.completedRentals}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-900">
                    {formatCurrency(vehicle.rentalRevenue)}
                  </td>
                </tr>
              ))}

              {vehicles.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No vehicle performance data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent bookings */}
      <RecentBookings />
    </div>
  );
}

export default AdminDashboard;
