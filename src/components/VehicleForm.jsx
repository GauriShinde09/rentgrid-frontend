
import { useState } from "react";

function VehicleForm({ onClose, onSave, loading, initialVehicle }) {
  const [vehicle, setVehicle] = useState({
    name: initialVehicle?.name || "",
    brand: initialVehicle?.brand || "",
    model: initialVehicle?.model || "",
    vehicleType: initialVehicle?.vehicleType || "SEDAN",
    registrationNumber: initialVehicle?.registrationNumber || "",
    fuelType: initialVehicle?.fuelType || "PETROL",
    transmission: initialVehicle?.transmission || "MANUAL",
    seatingCapacity: initialVehicle?.seatingCapacity ?? 5,
    pricePerDay: initialVehicle?.pricePerDay ?? "",
    includedKmPerDay: initialVehicle?.includedKmPerDay ?? 100,
    extraKmRate: initialVehicle?.extraKmRate ?? "",
    status: initialVehicle?.status || "AVAILABLE",
    description: initialVehicle?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVehicle({
      ...vehicle,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vehicleData = {
      ...vehicle,
      seatingCapacity: Number(vehicle.seatingCapacity),
      pricePerDay: Number(vehicle.pricePerDay),
      includedKmPerDay: Number(vehicle.includedKmPerDay),
      extraKmRate: Number(vehicle.extraKmRate),
    };

    onSave(vehicleData);
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

        {/* Form header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[2px] text-blue-600">
              FLEET MANAGEMENT
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              {initialVehicle ? "Update Vehicle" : "Add New Vehicle"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {initialVehicle
                ? "Update the details of your existing vehicle."
                : "Enter the details of the vehicle you want to add."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Vehicle name */}
            <label className="text-sm font-semibold text-slate-700">
              Vehicle Name *
              <input
                className={inputClass}
                name="name"
                value={vehicle.name}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Swift Dzire"
                required
              />
            </label>

            {/* Brand */}
            <label className="text-sm font-semibold text-slate-700">
              Brand *
              <input
                className={inputClass}
                name="brand"
                value={vehicle.brand}
                onChange={handleChange}
                maxLength={50}
                placeholder="e.g. Maruti Suzuki"
                required
              />
            </label>

            {/* Model */}
            <label className="text-sm font-semibold text-slate-700">
              Model *
              <input
                className={inputClass}
                name="model"
                value={vehicle.model}
                onChange={handleChange}
                maxLength={50}
                placeholder="e.g. Dzire VXI"
                required
              />
            </label>

            {/* Registration number */}
            <label className="text-sm font-semibold text-slate-700">
              Registration Number *
              <input
                className={inputClass}
                name="registrationNumber"
                value={vehicle.registrationNumber}
                onChange={handleChange}
                maxLength={20}
                placeholder="e.g. MH12AB1234"
                required
              />
            </label>

            {/* Vehicle type */}
            <label className="text-sm font-semibold text-slate-700">
              Vehicle Type *
              <select
                className={inputClass}
                name="vehicleType"
                value={vehicle.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="MUV">MUV</option>
              </select>
            </label>

            {/* Fuel type */}
            <label className="text-sm font-semibold text-slate-700">
              Fuel Type *
              <select
                className={inputClass}
                name="fuelType"
                value={vehicle.fuelType}
                onChange={handleChange}
                required
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>

            {/* Transmission */}
            <label className="text-sm font-semibold text-slate-700">
              Transmission *
              <select
                className={inputClass}
                name="transmission"
                value={vehicle.transmission}
                onChange={handleChange}
                required
              >
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </label>

            {/* Seating capacity */}
            <label className="text-sm font-semibold text-slate-700">
              Seating Capacity *
              <input
                className={inputClass}
                type="number"
                name="seatingCapacity"
                value={vehicle.seatingCapacity}
                onChange={handleChange}
                min="1"
                max="100"
                step="1"
                required
              />
            </label>

            {/* Daily price */}
            <label className="text-sm font-semibold text-slate-700">
              Price Per Day (₹) *
              <input
                className={inputClass}
                type="number"
                name="pricePerDay"
                value={vehicle.pricePerDay}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="1800"
                required
              />
            </label>

            {/* Included kilometers */}
            <label className="text-sm font-semibold text-slate-700">
              Included KM Per Day *
              <input
                className={inputClass}
                type="number"
                name="includedKmPerDay"
                value={vehicle.includedKmPerDay}
                onChange={handleChange}
                min="1"
                step="1"
                required
              />
            </label>

            {/* Extra kilometer rate */}
            <label className="text-sm font-semibold text-slate-700">
              Extra KM Rate (₹) *
              <input
                className={inputClass}
                type="number"
                name="extraKmRate"
                value={vehicle.extraKmRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="12"
                required
              />
            </label>

            {/* Status */}
           <div>
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Vehicle Status
  </label>

  <select
    name="status"
    value={vehicle.status}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
  >
    <option value="AVAILABLE">Available</option>
    <option value="BOOKED">Booked</option>
    <option value="UNDER_MAINTENANCE">Under Maintenance</option>
    <option value="OUT_OF_SERVICE">Out of Service</option>
  </select>
</div>

            {/* Description */}
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Description
              <textarea
                className={inputClass}
                name="description"
                value={vehicle.description}
                onChange={handleChange}
                maxLength={1000}
                rows={3}
                placeholder="Enter vehicle details..."
              />
            </label>
          </div>

          {/* Form actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialVehicle
                ? "Update Vehicle"
                : "Save Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
