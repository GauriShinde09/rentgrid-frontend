import { useEffect, useMemo, useState } from "react";
import api from "./api/axiosConfig";
import VehicleDetails from "./components/VehicleDetails";
import BookingModal from "./components/BookingModal";
import MyBookings from "./components/MyBookings";
import Login from "./components/Login";
import ManageBookings from "./components/admin/ManageBookings";
import RentalHistory from "./components/RentalHistory";
import MyProfile from "./components/MyProfile";
import Register from "./components/Register";
import AvailabilityNotification from "./components/AvailabilityNotification";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./components/AdminDashboard";
import AIAvailabilityChat from "./components/AIAvailabilityChat";
import AIDamageAssessment from "./components/admin/AIDamageAssessment";
import CustomerSupport from "./components/CustomerSupport";
import AdminSupport from "./components/admin/AdminSupport";

// Images stay on the frontend because the Vehicle entity has no image field.
const vehicleImages = [
  {
  match: ["tata nexon", "nexon"],
  image: "/images/nexon.jpg",
  rating: 4.7,
  tag: "Top rated",
},
{
  match: ["honda city", "city"],
  image: "/images/honda-city.jpg",
  rating: 4.6,
  tag: "Comfort pick",
},
{
  match: ["scorpio-n", "scorpio n"],
  image: "/images/scorpio-n.jpg",
  rating: 4.9,
  tag: "Premium SUV",
},
{
  match: ["kia carens", "carens"],
  image: "/images/carens.jpg",
  rating: 4.7,
  tag: "Family pick",
},
 {
  match: ["swift dzire", "dzire"],
  image: "/images/swift-dzire.jpg",
  rating: 4.7,
  tag: "Budget friendly",
},
{
  match: ["hyundai creta", "creta"],
  image: "/images/creta.jpg",
  rating: 4.8,
  tag: "Popular",
},
];

function formatVehicle(vehicle) {
  const name = String(vehicle.name || "").trim();
  const matchedImage = vehicleImages.find((item) =>
    item.match.some((part) => name.toLowerCase().includes(part))
  );

  return {
    ...vehicle,
    id: vehicle.id,
    name: name || `${vehicle.brand || "Vehicle"} ${vehicle.model || ""}`.trim(),
    type: String(vehicle.vehicleType || "Other").toUpperCase(),
    transmission: vehicle.transmission || "Not specified",
    fuel: vehicle.fuelType || "Not specified",
    seats: vehicle.seatingCapacity ?? "N/A",
    price: Number(vehicle.pricePerDay ?? 0),
    image: matchedImage?.image || "https://placehold.co/1000x600/eaf0f8/334155?text=Vehicle",
    rating: matchedImage?.rating ?? null,
    tag: matchedImage?.tag || "Available vehicle",
  };
}

const customerNavItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "Vehicles", icon: "▣" },
  { name: "My Bookings", icon: "▤" },
  { name: "Rental History", icon: "◷" },
  { name: "My Profile", icon: "♙" },
    { name: "Contact Support", icon: "🎧" },
];

const adminNavItems = [
  { name: "Admin Dashboard", icon: "▦" },
  { name: "Manage Vehicles", icon: "▣" },
  { name: "Manage Bookings", icon: "▤" },
  { name: "AI Damage Assessment", icon: "✦" },
  { name: "Support Requests", icon: "🎧" },
];

const money = (amount) =>
  "₹" + Number(amount).toLocaleString("en-IN");

function App() {
  const [activePage, setActivePage] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      const role = String(savedUser?.role || "CUSTOMER").replace("ROLE_", "").toUpperCase();
      return role === "ADMIN" ? "Admin Dashboard" : "Dashboard";
    } catch {
      return "Dashboard";
    }
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [payment, setPayment] = useState("UPI");
  const [notice, setNotice] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState("");
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
   
  const emptyVehicleForm = {
    name: "", brand: "", model: "", vehicleType: "SUV", registrationNumber: "",
    fuelType: "PETROL", transmission: "MANUAL", seatingCapacity: "5", pricePerDay: "",
    includedKmPerDay: "", extraKmRate: "", status: "AVAILABLE", description: ""
  };
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingConflict, setBookingConflict] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // Only keep the user logged in when both the token and user data exist.
    if (!token || !savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  async function handleLogin(credentials) {
    setLoginLoading(true);

    try {
      const response = await api.post("/rentgrid/auth/login", credentials);
      const data = response.data || {};
      const token = data.token;

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      const role = String(data.role || "CUSTOMER")
        .replace("ROLE_", "")
        .toUpperCase();

      const loggedInUser = {
  name: data.name || "",
  email: data.email || credentials.email,
  role,
};

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setShowLogin(false);
      setShowLogoutConfirm(false);
      setActivePage(role === "ADMIN" ? "Admin Dashboard" : "Dashboard");
      notify(data.message || "Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      const message = error.response?.data?.message || error.response?.data?.error;
      notify(message || error.message || "Login failed. Please check your email and password.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    setUser(null);
    setBookings([]);
    setBookingError("");
    setActivePage("Dashboard");
    setShowVehicleDetails(false);
    setShowBooking(false);
    setShowLogin(false);
    setShowLogoutConfirm(false);
    notify("You have been logged out successfully.");
  }

  async function loadVehicles() {
    setLoadingVehicles(true);
    setVehicleError("");

    try {
      const response = await api.get("/rentgrid/vehicles");
      const data = Array.isArray(response.data) ? response.data : [];
      setVehicles(data.map(formatVehicle));
    } catch (error) {
      console.error("Could not load vehicles:", error);
      setVehicleError(
        "We could not load vehicles. Please check that the Spring Boot backend is running and try again."
      );
    } finally {
      setLoadingVehicles(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const duration =
    pickupDate && returnDate && returnDate > pickupDate
      ? Math.ceil(
          (new Date(returnDate + "T12:00:00") -
            new Date(pickupDate + "T12:00:00")) /
            86400000
        )
      : 1;

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || vehicle.type === category.toUpperCase();

      return matchesSearch && matchesCategory;
    });
  }, [vehicles, search, category]);

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function openBooking(vehicle) {
    if (vehicle.status !== "AVAILABLE") {
      notify("This vehicle is not available for booking.");
      return;
    }

    setSelectedVehicle(vehicle);
    setShowBooking(true);
    setNotice("");
  }

  function openVehicleForm(vehicle = null) {
    setEditingVehicle(vehicle);
    if (vehicle) {
      setVehicleForm({
        name: vehicle.name || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        vehicleType: vehicle.vehicleType || vehicle.type || "SUV",
        registrationNumber: vehicle.registrationNumber || "",
        fuelType: vehicle.fuelType || "PETROL",
        transmission: vehicle.transmission || "MANUAL",
        seatingCapacity: String(vehicle.seatingCapacity ?? vehicle.seats ?? 5),
        pricePerDay: String(vehicle.pricePerDay ?? vehicle.price ?? ""),
        includedKmPerDay: String(vehicle.includedKmPerDay ?? ""),
        extraKmRate: String(vehicle.extraKmRate ?? ""),
        status: vehicle.status || "AVAILABLE",
        description: vehicle.description || ""
      });
    } else {
      setVehicleForm({ ...emptyVehicleForm });
    }
    setShowVehicleForm(true);
  }

  function updateVehicleForm(event) {
    const { name, value } = event.target;
    setVehicleForm((current) => ({ ...current, [name]: value }));
  }

  async function saveVehicle(event) {
    event.preventDefault();
    setSavingVehicle(true);

    const payload = {
      ...vehicleForm,
      seatingCapacity: Number(vehicleForm.seatingCapacity),
      pricePerDay: Number(vehicleForm.pricePerDay),
      includedKmPerDay: Number(vehicleForm.includedKmPerDay),
      extraKmRate: Number(vehicleForm.extraKmRate)
    };

    try {
      if (editingVehicle) {
        await api.put(`/rentgrid/vehicles/${editingVehicle.id}`, payload);
        notify("Vehicle updated successfully!");
      } else {
        await api.post("/rentgrid/vehicles", payload);
        notify("Vehicle added successfully!");
      }
      setShowVehicleForm(false);
      setEditingVehicle(null);
      await loadVehicles();
    } catch (error) {
      console.error("Could not save vehicle:", error);
      const message = error.response?.data?.message || error.response?.data?.error;
      notify(message || (error.response?.status === 403
        ? "Only an admin can manage vehicles."
        : "Could not save vehicle. Check the required fields and backend API."));
    } finally {
      setSavingVehicle(false);
    }
  }

  function deleteVehicle(vehicle) {
    // Open the custom confirmation modal before making the API request.
    setVehicleToDelete(vehicle);
  }

  async function confirmDeleteVehicle() {
    if (!vehicleToDelete) return;

    setDeletingVehicle(true);
    try {
      await api.delete(`/rentgrid/vehicles/${vehicleToDelete.id}`);
      setVehicles((current) =>
        current.filter((item) => item.id !== vehicleToDelete.id)
      );
      setVehicleToDelete(null);
      notify("Vehicle deleted successfully!");
    } catch (error) {
      console.error("Could not delete vehicle:", error);
      const message = error.response?.data?.message || error.response?.data?.error;
      notify(message || (error.response?.status === 403
        ? "Only an admin can delete vehicles."
        : "Could not delete vehicle. Check the backend API."));
    } finally {
      setDeletingVehicle(false);
    }
  }

  async function loadMyBookings() {
    setLoadingBookings(true);
    setBookingError("");

    try {
      const response = await api.get("/rentgrid/bookings/my");
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Could not load bookings:", error);
      setBookingError(
        error.response?.status === 401 || error.response?.status === 403
          ? "Please log in with a customer account to view your bookings."
          : "Could not load bookings. Please check that the backend is running and try again."
      );
    } finally {
      setLoadingBookings(false);
    }
  }

  async function createBooking(bookingData) {
    setBookingLoading(true);
    setNotice("");

    try {
      const response = await api.post("/rentgrid/bookings", bookingData);

      setShowBooking(false);
      setBookingConflict(null);
      setPickupDate("");
      setReturnDate("");
      notify(`Booking created successfully! Status: ${response.data.status}`);
      setActivePage("My Bookings");
      await loadMyBookings();
    } catch (error) {
      console.error("Could not create booking:", error);

      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "";

      if (status === 409) {
        setBookingConflict({
          vehicle: selectedVehicle,
          pickupDate: bookingData.pickupDate,
          returnDate: bookingData.returnDate,
          message: message || "This vehicle is already booked for these dates.",
        });
        setShowBooking(false);
      } else {
        notify(
          message ||
            (status === 401 || status === 403
              ? "Please log in with a customer account before booking."
              : "Booking failed. Please check the selected dates and try again.")
        );
      }
    } finally {
      setBookingLoading(false);
    }
  }
async function cancelMyBooking(booking) {
  const bookingId = booking.id ?? booking.bookingId;

  if (bookingId === null || bookingId === undefined) {
    notify("Booking ID was not found.");
    return;
  }

  setCancellingBookingId(bookingId);

  try {
    const response = await api.put(
      `/rentgrid/bookings/${bookingId}/cancel`
    );

    notify(response.data?.message || "Booking cancelled successfully!");
    await loadMyBookings();
  } catch (error) {
    console.error("Could not cancel booking:", error);

    const message =
      error.response?.data?.message ||
      (error.response?.status === 403
        ? "You are not allowed to cancel this booking."
        : "Could not cancel booking. Please try again.");

    notify(message);
  } finally {
    setCancellingBookingId(null);
  }
}
  function renderVehicles() {
    return (
      <>
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[2px] text-blue-600">
              FIND YOUR NEXT RIDE
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {activePage === "Vehicles"
                ? "Explore Vehicles"
                : "Popular Vehicles"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose a car that fits your journey.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:w-56"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="All">All categories</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
        </div>

        {loadingVehicles && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-semibold">Loading vehicles...</p>
            <p className="mt-2 text-sm text-slate-500">
              Fetching the latest vehicles from RentGrid.
            </p>
          </div>
        )}

        {!loadingVehicles && vehicleError && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-bold text-red-700">Could not load vehicles</p>
            <p className="mt-2 text-sm text-slate-500">{vehicleError}</p>
            <button
              onClick={loadVehicles}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        )}

        {!loadingVehicles && !vehicleError && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/1000x600/eaf0f8/334155?text=Vehicle+Image";
                  }}
                />

                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow">
                  {vehicle.tag}
                </span>

                {vehicle.rating && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white">
                    ★ {vehicle.rating}
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {vehicle.type} · {vehicle.transmission}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {vehicle.name}
                </h3>

                <div className="mt-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      vehicle.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : vehicle.status === "BOOKED"
                        ? "bg-amber-100 text-amber-700"
                        : vehicle.status === "UNDER_MAINTENANCE"
                        ? "bg-orange-100 text-orange-700"
                        : vehicle.status === "OUT_OF_SERVICE"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {vehicle.status
                      ? vehicle.status.replaceAll("_", " ")
                      : "STATUS UNKNOWN"}
                  </span>
                </div>

                <div className="mt-3 flex gap-4 text-sm text-slate-500">
                  <span>♙ {vehicle.seats} seats</span>
                  <span>⛽ {vehicle.fuel}</span>
                </div>

                <div className="my-4 border-t border-slate-100" />

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-extrabold">
                      {money(vehicle.price)}
                    </p>
                    <p className="text-xs text-slate-500">per day</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setActivePage("Vehicles");
                        setShowVehicleDetails(true);
                      }}
                      className="rounded-xl border border-blue-600 px-3 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                    >
                      View details
                    </button>
                    <button
                      onClick={() => openBooking(vehicle)}
                      disabled={vehicle.status !== "AVAILABLE"}
                      className={`rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
                        vehicle.status === "AVAILABLE"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "cursor-not-allowed bg-slate-400"
                      }`}
                    >
                      {vehicle.status === "AVAILABLE" ? "Book now →" : "Not available"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
            </div>

            {filteredVehicles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-lg font-bold">No vehicles found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try another search or category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
            )}
          </>
        )}
      </>
    );
  }

  const isAdmin = String(user?.role || "CUSTOMER").replace("ROLE_", "").toUpperCase() === "ADMIN";
  const navItems = isAdmin ? adminNavItems : customerNavItems;

  function renderPage() {
    if (isAdmin && activePage === "Admin Dashboard") {
      return <AdminDashboard />;
    }

    if (isAdmin && activePage === "Manage Vehicles") {
      return (
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold">Manage Vehicles</h2>
              <p className="mt-1 text-sm text-slate-500">Add, edit, and remove vehicles from your inventory.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">{vehicles.length} vehicles</span>
              <button onClick={() => openVehicleForm()} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">+ Add Vehicle</button>
            </div>
          </div>

          {loadingVehicles ? <p className="rounded-2xl bg-white p-6 text-slate-500">Loading vehicles...</p> : vehicleError ? (
            <div className="rounded-2xl bg-white p-6"><p className="text-red-600">{vehicleError}</p><button onClick={loadVehicles} className="mt-3 font-semibold text-blue-600">Try again</button></div>
          ) : vehicles.length === 0 ? <p className="rounded-2xl bg-white p-6 text-slate-500">No vehicles yet. Select Add Vehicle to create the first one.</p> : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4">Registration</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price / day</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th></tr></thead>
                <tbody>{vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-slate-100">
                    <td className="px-5 py-4"><p className="font-semibold">{vehicle.name}</p><p className="mt-1 text-xs text-slate-500">{vehicle.brand} {vehicle.model}</p></td>
                    <td className="px-5 py-4">{vehicle.registrationNumber || "—"}</td>
                    <td className="px-5 py-4">{vehicle.type}</td>
                    <td className="px-5 py-4 font-semibold">{money(vehicle.price)}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{String(vehicle.status || "UNKNOWN").replaceAll("_", " ")}</span></td>
                    <td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => openVehicleForm(vehicle)} className="rounded-lg border border-blue-200 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50">Edit</button><button onClick={() => deleteVehicle(vehicle)} className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50">Delete</button></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {showVehicleForm && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4">
              <form onSubmit={saveVehicle} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-3"><div><h3 className="text-2xl font-extrabold">{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3><p className="mt-1 text-sm text-slate-500">Enter the vehicle details below.</p></div><button type="button" onClick={() => setShowVehicleForm(false)} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100" aria-label="Close form">✕</button></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">Vehicle name *<input required name="name" value={vehicleForm.name} onChange={updateVehicleForm} placeholder="e.g. Tata Nexon" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500" /></label>
                  <label className="text-sm font-semibold">Brand *<input required name="brand" value={vehicleForm.brand} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500" /></label>
                  <label className="text-sm font-semibold">Model *<input required name="model" value={vehicleForm.model} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500" /></label>
                  <label className="text-sm font-semibold">Registration number *<input required name="registrationNumber" value={vehicleForm.registrationNumber} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500" /></label>
                  <label className="text-sm font-semibold">Vehicle type *<select name="vehicleType" value={vehicleForm.vehicleType} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option value="SUV">SUV</option><option value="SEDAN">Sedan</option><option value="HATCHBACK">Hatchback</option><option value="MPV">MPV</option><option value="OTHER">Other</option></select></label>
                  <label className="text-sm font-semibold">Fuel type *<select name="fuelType" value={vehicleForm.fuelType} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option value="PETROL">Petrol</option><option value="DIESEL">Diesel</option><option value="ELECTRIC">Electric</option><option value="HYBRID">Hybrid</option><option value="CNG">CNG</option></select></label>
                  <label className="text-sm font-semibold">Transmission *<select name="transmission" value={vehicleForm.transmission} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option value="MANUAL">Manual</option><option value="AUTOMATIC">Automatic</option></select></label>
                  <label className="text-sm font-semibold">Seating capacity *<input required min="1" type="number" name="seatingCapacity" value={vehicleForm.seatingCapacity} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label>
                  <label className="text-sm font-semibold">Price per day (₹) *<input required min="1" type="number" name="pricePerDay" value={vehicleForm.pricePerDay} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label>
                  <label className="text-sm font-semibold">Included km per day *<input required min="0" type="number" name="includedKmPerDay" value={vehicleForm.includedKmPerDay} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label>
                  <label className="text-sm font-semibold">Extra km rate (₹) *<input required min="0" type="number" name="extraKmRate" value={vehicleForm.extraKmRate} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label>
                  <label className="text-sm font-semibold">Status *<select name="status" value={vehicleForm.status} onChange={updateVehicleForm} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option value="AVAILABLE">Available</option><option value="BOOKED">Booked</option><option value="UNDER_MAINTENANCE">Under maintenance</option><option value="OUT_OF_SERVICE">Out of service</option></select></label>
                  <label className="text-sm font-semibold sm:col-span-2">Description<textarea name="description" value={vehicleForm.description} onChange={updateVehicleForm} rows="3" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500" /></label>
                </div>
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowVehicleForm(false)} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700">Cancel</button><button type="submit" disabled={savingVehicle} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{savingVehicle ? "Saving..." : editingVehicle ? "Save Changes" : "Add Vehicle"}</button></div>
              </form>
            </div>
          )}
        </section>
      );
    }

   if (isAdmin && activePage === "Manage Bookings") {
   return <ManageBookings />;
}
if (isAdmin && activePage === "AI Damage Assessment") {
  return <AIDamageAssessment />;
}

    if (!isAdmin && activePage === "Vehicles") {
      return renderVehicles();
    }

  if (!isAdmin && activePage === "My Bookings") {
  return (
    <MyBookings
      bookings={bookings}
      loading={loadingBookings}
      error={bookingError}
      onRetry={loadMyBookings}
      onExplore={() => setActivePage("Vehicles")}
      onCancel={cancelMyBooking}
      cancellingBookingId={cancellingBookingId}
    />
  );
}

if (!isAdmin && activePage === "Rental History") {
  return <RentalHistory />;
}
if (!isAdmin && activePage === "My Profile") {
  return <MyProfile />;
}

    if (activePage === "Contact Support") {
  return <CustomerSupport />;
}

if (activePage === "Support Requests") {
  return <AdminSupport />;
}
    return (
      <>
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-7 text-white sm:p-10 lg:p-12">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-bold tracking-[2px] text-blue-300">
              YOUR JOURNEY STARTS HERE
            </p>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Find your perfect ride.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-blue-100">
              Comfort, freedom and adventure — all in one place.
              Choose a car for your next journey.
            </p>
            <button
              onClick={() => setActivePage("Vehicles")}
              className="mt-7 rounded-xl bg-blue-500 px-6 py-3 font-bold transition hover:bg-blue-400"
            >
              Explore Vehicles →
            </button>
          </div>

          <div className="pointer-events-none absolute -bottom-16 -right-5 text-[180px] font-black text-white/5 sm:text-[240px]">
            RG
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Vehicles available", value: vehicles.length, icon: "🚘" },
            { label: "Vehicle categories", value: new Set(vehicles.map((vehicle) => vehicle.type)).size, icon: "▦" },
            { label: "Starting from", value: vehicles.length ? `${money(Math.min(...vehicles.map((vehicle) => vehicle.price)))}/day` : "—", icon: "₹" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="mt-3 text-2xl font-extrabold">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          {renderVehicles()}
        </section>
      </>
    );
  }

 
  // Check if the Reset Password page is open
  const isResetPasswordPage =
    window.location.pathname === "/reset-password";

  // Show Reset Password page before Login/Register
  if (isResetPasswordPage) {
    return (
      <ResetPassword
        onBackToLogin={() => {
          window.history.replaceState({}, "", "/");
          window.location.reload();
        }}
      />
    );
  }
  // Show Register or Login when the user is logged out
  if (!user) {
    return showRegister ? (
      <Register
        onBackToLogin={() => setShowRegister(false)}
        onClose={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onSubmit={handleLogin}
        onClose={() => {}}
        onRegisterClick={() => setShowRegister(true)}
        loading={loginLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#111827] p-6 text-white md:flex">
        <button
          onClick={() => setActivePage("Dashboard")}
          className="mb-12 text-left text-2xl font-extrabold tracking-tight"
        >
          RentGrid<span className="text-blue-400">.</span>
        </button>

        <p className="mb-3 px-3 text-xs font-bold tracking-widest text-slate-500">
          MENU
        </p>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActivePage(item.name);
                setShowVehicleDetails(false);
                if (item.name === "My Bookings") loadMyBookings();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${
                activePage === item.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-700 bg-slate-800 p-4">
          <div className="text-2xl">✦</div>
          <p className="mt-3 font-bold">Need assistance?</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your next journey starts with the right car.
          </p>
          <button
  onClick={() => setActivePage(
    isAdmin ? "Support Requests" : "Contact Support"
  )}
  className="mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold hover:bg-blue-500"
>
  Contact support
</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-9">
        <header className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[2px] text-slate-500">
              {isAdmin ? "RENTGRID · ADMIN PORTAL" : "RENTGRID · CUSTOMER PORTAL"}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              {activePage === "Dashboard" ? `Hello, ${user?.name || "there"} 👋` : activePage === "Admin Dashboard" ? "Welcome, Admin" : activePage}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            )}
            <button
              onClick={() => notify("You're all caught up!")}
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white"
            >
              ♧
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
            </div>
          </div>
        </header>

        <div className="mb-6 flex gap-2 overflow-x-auto md:hidden">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActivePage(item.name);
                setShowVehicleDetails(false);
                if (item.name === "My Bookings") loadMyBookings();
              }}
              className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold ${
                activePage === item.name
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {showVehicleDetails && selectedVehicle ? (
          <VehicleDetails
            vehicle={selectedVehicle}
            onBack={() => setShowVehicleDetails(false)}
            onBook={(vehicle) => {
              setShowVehicleDetails(false);
              openBooking(vehicle);
            }}
          />
        ) : (
          renderPage()
        )}

        <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          © 2026 RentGrid · Your journey, your way.
        </footer>
      </main>

      {notice && (
        <div
          role="status"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[90%] max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center text-base font-semibold text-slate-800 shadow-2xl"
        >
          {notice}
        </div>
      )}

      {vehicleToDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-vehicle-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              ⚠
            </div>
            <h2 id="delete-vehicle-title" className="mt-4 text-center text-xl font-bold text-slate-900">
              Confirm Delete
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-600">
              Are you sure you want to delete <span className="font-bold text-slate-900">{vehicleToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deletingVehicle}
                onClick={() => setVehicleToDelete(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingVehicle}
                onClick={confirmDeleteVehicle}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingVehicle ? "Deleting..." : "Delete Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && user && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
              ?
            </div>
            <h2 id="logout-title" className="mt-4 text-center text-xl font-bold text-slate-900">
              Confirm Logout
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-600">
              Are you sure you want to log out of RentGrid?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

     
  {showLogin && (
    showRegister ? (
      <Register
        onBackToLogin={() => setShowRegister(false)}
        onClose={() => {
          setShowRegister(false);
          setShowLogin(false);
        }}
      />
    ) : (
      <Login
        onSubmit={handleLogin}
        onClose={() => setShowLogin(false)}
        onRegisterClick={() => setShowRegister(true)}
        loading={loginLoading}
      />
    )
  )}


      {showBooking && selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          onClose={() => setShowBooking(false)}
          onSubmit={createBooking}
          loading={bookingLoading}
        />
      )}

     {bookingConflict && (
  <AvailabilityNotification
    vehicleId={bookingConflict.vehicle.id}
    pickupDate={bookingConflict.pickupDate}
    returnDate={bookingConflict.returnDate}
    onClose={() => setBookingConflict(null)}
    notify={notify}
  />
)} 

   {/* AI assistant for customers only */}
      
{!isAdmin && (
  <AIAvailabilityChat
    onViewDetails={(aiVehicle) => {
      const vehicle = vehicles.find(
        (item) => String(item.id) === String(aiVehicle.id)
      );

      if (!vehicle) {
        notify("Vehicle details could not be found.");
        return;
      }

      setSelectedVehicle(vehicle);
      setActivePage("Vehicles");
      setShowVehicleDetails(true);
    }}
    onBook={(aiVehicle) => {
      const vehicle = vehicles.find(
        (item) => String(item.id) === String(aiVehicle.id)
      );

      if (!vehicle) {
        notify("Vehicle details could not be found.");
        return;
      }

      openBooking(vehicle);
    }}
  />
)}

    </div>
  );
}

export default App;
