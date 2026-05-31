import { BookOpen, MapPin, Calendar, Search, Trash2, RefreshCw ,Check, X, Armchair, Clock } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/Context";

const filters = ["All", "Confirmed", "Pending", "Cancelled"];

const getStatusBadgeClass = (status) => {
  const s = status?.toLowerCase();
  if (s === "confirmed") return "bg-green-100 text-green-600 border-green-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-600 border-yellow-200";
  if (s === "cancelled") return "bg-red-50 text-red-500 border-red-200";
  return "bg-yellow-100 text-yellow-600 border-yellow-200";
};

const getStatusText = (status) => {
  const s = status?.toLowerCase();
  if (s === "confirmed") return "Confirmed";
  if (s === "cancelled") return "Cancelled";
  return "Pending";
};

const ManageBookings = () => {
  const { bookings, deleteBooking, updateStatus, getAllBookings } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = bookings?.filter((b) => {
    const matchSearch =
      b.passengerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.fromCity?.toLowerCase().includes(search.toLowerCase()) ||
      b.toCity?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      (b.selectedSeats && b.selectedSeats.join(",").includes(search.toLowerCase()));
    const matchFilter =
      activeFilter === "All" ||
      b.bookingStatus?.toLowerCase() === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const handleRefresh = async () => {
  setLoading(true);
  await getAllBookings(); 
  setLoading(false);
};

  const handleConfirm = (id) => updateStatus(id, "confirmed");
  const handleCancel = (id) => updateStatus(id, "cancelled");
  const handleDelete = (id) => deleteBooking(id);

  const getRouteDisplay = (booking) => {
    const fromCity = booking.fromCity || booking.bus?.fromCity;
    const toCity = booking.toCity || booking.bus?.toCity;
    if (fromCity && toCity) return `${fromCity} → ${toCity}`;
    return "—";
  };

  const getDateDisplay = (booking) => {
    return booking.date || booking.bus?.date || "—";
  };

  const getTimeDisplay = (booking) => {
    if (booking.departureTime && booking.departureTime !== "—") return booking.departureTime;
    if (booking.bus?.departureTime) return booking.bus.departureTime;
    return "—";
  };

  const getPriceDisplay = (booking) => {
    const price = booking.price || booking.bus?.price || 0;
    const seatCount = booking.selectedSeats?.length || 1;
    return price * seatCount;
  };

  return (
    <div className="space-y-4 sm:space-y-5">

    
<div className="flex items-start justify-between gap-3">
  <div>
    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">Manage Bookings</h1>
    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{bookings?.length} total bookings</p>
  </div>

  <div className="flex items-center gap-2 shrink-0">
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
    >
      <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
      Refresh
    </button>
    <div className="hidden sm:flex items-center gap-2">
      {["Confirmed", "Pending", "Cancelled"].map((s) => (
        <span key={s} className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border ${getStatusBadgeClass(s)}`}>
          {bookings?.filter(b => b.bookingStatus?.toLowerCase() === s.toLowerCase()).length} {s}
        </span>
      ))}
    </div>
  </div>
</div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

  
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex flex-col gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, seat or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1 w-full overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap flex-1
                  ${activeFilter === f ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

  
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold">Booking ID</th>
                <th className="px-5 py-3 text-left font-semibold">Passenger</th>
                <th className="px-5 py-3 text-left font-semibold">Route</th>
                <th className="px-5 py-3 text-left font-semibold hidden lg:table-cell">Seats</th>
                <th className="px-5 py-3 text-left font-semibold hidden xl:table-cell">Date</th>
                <th className="px-5 py-3 text-left font-semibold hidden xl:table-cell">Time</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.length > 0 ? filtered.map((b) => (
                <tr key={b.bookingId} className="hover:bg-gray-50/70 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      #{b.bookingId}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-extrabold uppercase">{b.passengerName?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{b.passengerName}</p>
                        <p className="text-xs text-gray-400">{b?.user?.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin size={12} className="text-primary shrink-0" />
                      <span className="font-medium">{getRouteDisplay(b)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {b.selectedSeats && b.selectedSeats.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Armchair size={12} className="text-primary shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {b.selectedSeats.map(seat => (
                            <span key={seat} className="inline-flex items-center justify-center min-w-[28px] h-6 bg-primary/10 text-primary rounded-md text-xs font-bold px-1.5">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar size={11} />
                      {getDateDisplay(b)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Clock size={11} />
                      {getTimeDisplay(b)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-bold text-gray-800">
                        Rs. {getPriceDisplay(b).toLocaleString()}
                      </p>
                      {b.selectedSeats && b.selectedSeats.length > 1 && (
                        <p className="text-[10px] text-gray-400">
                          ({b.selectedSeats.length} seats)
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${getStatusBadgeClass(b?.bookingStatus)}`}>
                      {getStatusText(b?.bookingStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleConfirm(b._id)}
                        disabled={b.bookingStatus?.toLowerCase() === "confirmed"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer
                          ${b.bookingStatus?.toLowerCase() === "confirmed"
                            ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                            : "bg-green-50 hover:bg-green-100 border border-green-100 text-green-500"}`}
                        title="Confirm"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={b.bookingStatus?.toLowerCase() === "cancelled"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer
                          ${b.bookingStatus?.toLowerCase() === "cancelled"
                            ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                            : "bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 text-yellow-500"}`}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-400 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No bookings found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-50">
          {filtered?.length > 0 ? filtered.map((b) => (
            <div key={b.bookingId} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-extrabold uppercase">{b.passengerName?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{b.passengerName}</p>
                    <span className="font-mono text-[10px] text-gray-400">#{b.bookingId}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${getStatusBadgeClass(b?.bookingStatus)}`}>
                  {getStatusText(b?.bookingStatus)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={10} className="text-primary" />
                {getRouteDisplay(b)}
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={10} className="text-primary" />
                  {getDateDisplay(b)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-primary" />
                  {getTimeDisplay(b)}
                </div>
              </div>

              {b.selectedSeats && b.selectedSeats.length > 0 && (
                <div className="flex items-center gap-2">
                  <Armchair size={12} className="text-primary shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {b.selectedSeats.map(seat => (
                      <span key={seat} className="inline-flex items-center justify-center min-w-[26px] h-5 bg-primary/10 text-primary rounded-md text-xs font-bold px-1.5">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Rs. {getPriceDisplay(b).toLocaleString()}
                  </p>
                  {b.selectedSeats && b.selectedSeats.length > 1 && (
                    <p className="text-[9px] text-gray-400">
                      {b.selectedSeats.length} seats
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleConfirm(b._id)}
                    disabled={b.bookingStatus?.toLowerCase() === "confirmed"}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer
                      ${b.bookingStatus?.toLowerCase() === "confirmed"
                        ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                        : "bg-green-50 border border-green-100 text-green-500"}`}
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={b.bookingStatus?.toLowerCase() === "cancelled"}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer
                      ${b.bookingStatus?.toLowerCase() === "cancelled"
                        ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                        : "bg-yellow-50 border border-yellow-100 text-yellow-500"}`}
                  >
                    <X size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No bookings found</p>
            </div>
          )}
        </div>
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered?.length}</span> of{" "}
            <span className="font-semibold text-gray-600">{bookings?.length}</span> bookings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;