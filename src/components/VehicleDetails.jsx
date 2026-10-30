
function VehicleDetails({ vehicle, onBack, onBook }) {
  if (!vehicle) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <h2 className="text-xl font-bold">Vehicle not found</h2>

        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Back to vehicles
        </button>
      </div>
    );
  }

  const money = (amount) =>
    "₹" + Number(amount || 0).toLocaleString("en-IN");

  const status = String(vehicle.status || "").toUpperCase();
  const isAvailable = status === "AVAILABLE";

  const statusStyle =
    status === "AVAILABLE"
      ? "bg-green-100 text-green-700"
      : status === "BOOKED"
      ? "bg-amber-100 text-amber-700"
      : status === "UNDER_MAINTENANCE"
      ? "bg-orange-100 text-orange-700"
      : "bg-red-100 text-red-700";

  const statusLabel = status
    ? status.replaceAll("_", " ")
    : "STATUS UNKNOWN";

  return (
    <div className="w-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        ← Back to vehicles
      </button>

      {/* Vehicle Details Card */}
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
        {/* Vehicle Image */}
        <div className="flex min-h-[300px] items-center justify-center bg-slate-100 p-4 sm:p-6 lg:min-h-[620px]">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-64 w-full rounded-2xl object-contain sm:h-80 lg:h-[560px]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://placehold.co/1000x600/eaf0f8/334155?text=Vehicle+Image";
            }}
          />
        </div>

        {/* Vehicle Information */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-bold tracking-[3px] text-blue-600">
            RENTGRID VEHICLE DETAILS
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {vehicle.tag || "RentGrid Vehicle"}
            </span>

            {vehicle.rating && (
              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                ★ {vehicle.rating}
              </span>
            )}
          </div>

          {/* Vehicle Name */}
          <h1 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {vehicle.name}
          </h1>

          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">
            {vehicle.type || vehicle.vehicleType || "Vehicle"}
          </p>

          {/* Actual Vehicle Status */}
          <div className="mt-4">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${statusStyle}`}
            >
              {statusLabel}
            </span>
          </div>

          {!isAvailable && (
            <p className="mt-3 text-sm font-medium text-red-600">
              This vehicle is currently unavailable for booking.
            </p>
          )}

          {/* Price */}
          <div className="mt-7 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
              {money(vehicle.price ?? vehicle.pricePerDay)}
            </span>

            <span className="text-sm text-slate-500">/ day</span>
          </div>

          {/* Specifications */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Transmission</p>
              <p className="mt-2 font-bold text-slate-900">
                {vehicle.transmission || "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Fuel type</p>
              <p className="mt-2 font-bold text-slate-900">
                {vehicle.fuel || vehicle.fuelType || "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Seats</p>
              <p className="mt-2 font-bold text-slate-900">
                {vehicle.seats ?? vehicle.seatingCapacity ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              About this vehicle
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {vehicle.description ||
                "A comfortable vehicle for your next journey. Check the specifications and choose your rental dates."}
            </p>

            {vehicle.includedKmPerDay != null && (
              <p className="mt-3 text-sm text-slate-600">
                Included distance:{" "}
                <span className="font-semibold text-slate-900">
                  {vehicle.includedKmPerDay} km/day
                </span>
              </p>
            )}

            {vehicle.extraKmRate != null && (
              <p className="mt-2 text-sm text-slate-600">
                Extra kilometre charge:{" "}
                <span className="font-semibold text-slate-900">
                  {money(vehicle.extraKmRate)}/km
                </span>
              </p>
            )}
          </div>

          {/* Booking Button */}
          <button
            onClick={() => {
              if (isAvailable) {
                onBook(vehicle);
              }
            }}
            disabled={!isAvailable}
            className={`mt-8 w-full rounded-xl px-6 py-4 font-bold shadow-sm transition ${
              isAvailable
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]"
                : "cursor-not-allowed bg-slate-400 text-white"
            }`}
          >
            {isAvailable ? "Book this vehicle →" : "Not available"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
