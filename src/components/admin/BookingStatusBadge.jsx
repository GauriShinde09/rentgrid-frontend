
function BookingStatusBadge({ status }) {
  const currentStatus = String(status || "PENDING").toUpperCase();

  let color = "bg-slate-100 text-slate-700";

  if (currentStatus === "CONFIRMED" || currentStatus === "APPROVED") {
    color = "bg-green-100 text-green-700";
  } else if (currentStatus === "PENDING") {
    color = "bg-amber-100 text-amber-700";
  } else if (
    currentStatus === "REJECTED" ||
    currentStatus === "CANCELLED"
  ) {
    color = "bg-red-100 text-red-700";
  } else if (currentStatus === "COMPLETED") {
    color = "bg-blue-100 text-blue-700";
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
      {currentStatus.replaceAll("_", " ")}
    </span>
  );
}

export default BookingStatusBadge;
