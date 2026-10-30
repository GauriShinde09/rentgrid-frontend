
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import VehicleForm from "./VehicleForm";

function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
const [deleting, setDeleting] = useState(false);
  // Load all vehicles
  const loadVehicles = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/rentgrid/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Vehicle loading error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load vehicles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Add vehicle
  const saveVehicle = async (vehicleData) => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await api.post("/rentgrid/vehicles", vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowForm(false);
      await loadVehicles();

      window.alert("Vehicle added successfully!");
    } catch (error) {
      console.error("Add vehicle error:", error);

      window.alert(
        error.response?.data?.message ||
          "Unable to add vehicle. Please check the details."
      );
    } finally {
      setSaving(false);
    }
  };

  // Update vehicle
  const updateVehicle = async (vehicleData) => {
    if (!editingVehicle) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/rentgrid/vehicles/${editingVehicle.id}`,
        vehicleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingVehicle(null);
      await loadVehicles();

      window.alert("Vehicle updated successfully!");
    } catch (error) {
      console.error("Update vehicle error:", error);

      window.alert(
        error.response?.data?.message ||
          "Unable to update vehicle. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };
const deleteVehicle = async () => {
  if (!deletingVehicle) return;

  setDeleting(true);

  try {
    const token = localStorage.getItem("token");

    await api.delete(
      `/rentgrid/vehicles/${deletingVehicle.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDeletingVehicle(null);
    await loadVehicles();

    window.alert("Vehicle deleted successfully!");
  } catch (error) {
    console.error("Delete vehicle error:", error);

    window.alert(
      error.response?.data?.message ||
        "Unable to delete vehicle. It may be associated with existing bookings."
    );
  } finally {
    setDeleting(false);
  }
};
  // Search vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const text = search.toLowerCase();

    return (
      vehicle.name?.toLowerCase().includes(text) ||
      vehicle.brand?.toLowerCase().includes(text) ||
      vehicle.model?.toLowerCase().includes(text) ||
      vehicle.registrationNumber?.toLowerCase().includes(text)
    );
  });

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "AVAILABLE"
  ).length;

  const unavailableVehicles = vehicles.length - availableVehicles;

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-[2px] text-blue-600">
            FLEET CONTROL
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Vehicle Management
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage vehicles, rental prices and availability.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Vehicles
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
            {vehicles.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Available Vehicles
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-green-600">
            {availableVehicles}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Unavailable Vehicles
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-orange-600">
            {unavailableVehicles}
          </h3>
        </div>

      </div>

      {/* Vehicle table */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              All Vehicles
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {filteredVehicles.length} vehicle(s) found
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brand or registration..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 sm:max-w-sm"
          />
        </div>

        {loading ? (
          <p className="p-10 text-center text-slate-500">
            Loading vehicles...
          </p>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={loadVehicles}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-700">
              No vehicles found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or add a new vehicle.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Registration</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Price / Day</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">
                        {vehicle.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {vehicle.brand} · {vehicle.model}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {vehicle.registrationNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {vehicle.vehicleType}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-800">
                      ₹{Number(vehicle.pricePerDay || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          vehicle.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowForm(false);
                            setEditingVehicle(vehicle);
                          }}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                      <button
  onClick={() => setDeletingVehicle(vehicle)}
  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
>
  Delete
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </section>

      {/* Add Vehicle form */}
      {showForm && (
        <VehicleForm
          onClose={() => setShowForm(false)}
          onSave={saveVehicle}
          loading={saving}
        />
      )}

      {/* Edit Vehicle form */}
      {editingVehicle && (
        <VehicleForm
          key={editingVehicle.id}
          initialVehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={updateVehicle}
          loading={saving}
        />
      )}

      {deletingVehicle && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
        !
      </div>

      <h2 className="mt-4 text-xl font-bold text-slate-900">
        Delete Vehicle?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Are you sure you want to delete{" "}
        <strong>{deletingVehicle.name}</strong>? This action cannot be
        undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setDeletingVehicle(null)}
          disabled={deleting}
          className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
        >
          Cancel
        </button>

        <button
          onClick={deleteVehicle}
          disabled={deleting}
          className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default VehicleManagement;
