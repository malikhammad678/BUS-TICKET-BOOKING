import { BookOpen, MapPin, Calendar, Search, Eye, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/Context";



const ManageBookings = () => {
  const { bookings, deleteBooking, updateStatus } = useAppContext()
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = bookings?.filter((b) => {
    const matchSearch =
      b.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      b.fromCity.toLowerCase().includes(search.toLowerCase()) ||
      b.toCity.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(search.toLowerCase());

    const matchFilter = activeFilter === "All" || b.bookingStatus === activeFilter;

    return matchSearch && matchFilter;
  });

  const handleConfirm = (id) => updateStatus(id, "confirmed")
  const handleCancel = (id) => updateStatus(id, "cancelled")

  const handleDelete = (id) => {
     deleteBooking(id)
  };

  const statusColor = (status) => {
  if (status === "confirmed") return "bg-green-100 text-green-600 border-green-200";
  if (status === "pending") return "bg-yellow-100 text-yellow-600 border-yellow-200";
  if (status === "cancelled") return "bg-red-50 text-red-500 border-red-200";
  return "bg-gray-100 text-gray-500 border-gray-200";
};

const filters = ["All", "Confirmed", "Pending", "Cancelled"];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Manage Bookings</h1>
          <p className="text-sm text-gray-400 mt-0.5">{bookings?.length} total bookings</p>
        </div>

        {/* Status pills summary */}
        <div className="hidden sm:flex items-center gap-2">
          {["Confirmed", "Pending", "Cancelled"].map((s) => (
            <span key={s} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusColor(s)}`}>
              {bookings.filter(b => b.bookingStatus === s).length} {s}
            </span>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Search + Filter bar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
                  ${activeFilter === f
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold">Booking ID</th>
                <th className="px-5 py-3 text-left font-semibold">Passenger</th>
                <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Route</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((b) => (
                <tr key={b.bookingId} className="hover:bg-gray-50/70 transition-colors duration-150">

                  {/* Booking ID */}
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      #{b.bookingId}
                    </span>
                  </td>

                  {/* Passenger */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-extrabold uppercase">
                          {b.passengerName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{b.passengerName}</p>
                        <p className="text-xs text-gray-400">{b?.user?.email || "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin size={12} className="text-primary shrink-0" />
                      <span className="font-medium">{b?.bus?.fromCity}</span>
                      <span className="text-gray-300">→</span>
                      <span className="font-medium">{b?.bus?.toCity}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar size={11} />
                      {new Date(b?.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-gray-800">Rs. {b.bus?.price?.toLocaleString()}</p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusColor(b?.bookingStatus)}`}>
                      {b.bookingStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                    
                      <button
                        onClick={() => handleConfirm(b._id)}
                        className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 border border-green-100 flex items-center justify-center text-green-500 transition-all cursor-pointer"
                        title="Confirm"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="w-8 h-8 rounded-lg bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 flex items-center justify-center text-yellow-500 transition-all cursor-pointer"
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
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No bookings found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-600">{bookings.length}</span> bookings
          </p>
        </div>

      </div>
    </div>
  );
};

export default ManageBookings;