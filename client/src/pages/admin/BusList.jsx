import { Bus, MapPin, Clock, Trash2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/Context";

const busTypeColor = (type) => {
  if (type === "AC") return "bg-blue-50 text-blue-600 border-blue-100";
  if (type === "Sleeper") return "bg-purple-50 text-purple-600 border-purple-100";
  if (type === "Non-AC") return "bg-orange-50 text-orange-600 border-orange-100";
  if (type === "Mini") return "bg-green-50 text-green-600 border-green-100";
  return "bg-gray-100 text-gray-500";
};

const BusList = () => {
  const { navigate, buses, deleteBus } = useAppContext();
  const [search, setSearch] = useState("");

  const filtered = buses?.filter((b) =>
    b.busName.toLowerCase().includes(search.toLowerCase()) ||
    b.fromCity.toLowerCase().includes(search.toLowerCase()) ||
    b.toCity.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => deleteBus(id);

  return (
    <div className="space-y-4 sm:space-y-5">

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Bus List</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{buses.length} buses in the system</p>
        </div>
        <button
          onClick={() => navigate("/owner/add-bus")}
          className="flex items-center gap-1.5 sm:gap-2 bg-primary text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:scale-[1.02] hover:shadow-md hover:shadow-primary/20 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          Add Bus
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold">Bus</th>
                <th className="px-5 py-3 text-left font-semibold">Route</th>
                <th className="px-5 py-3 text-left font-semibold">Schedule</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Type</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/70 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={b.image} alt={b.busName} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">{b.busName}</p>
                        {b.bestSeller && (
                          <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                            ⭐ Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin size={12} className="text-primary shrink-0" />
                      <span className="font-medium">{b.fromCity}</span>
                      <span className="text-gray-300">→</span>
                      <span className="font-medium">{b.toCity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-700 font-medium">{b.departureTime}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {b.duration}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${busTypeColor(b.busType)}`}>
                      {b.busType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-gray-800">Rs. {b.price.toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center">
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
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Bus size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No buses found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-gray-50">
          {filtered.length > 0 ? filtered.map((b) => (
            <div key={b._id} className="p-4 flex items-start gap-3">
              <img src={b.image} alt={b.busName} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-800 text-sm truncate">{b.busName}</p>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 shrink-0 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin size={10} className="text-primary" />
                  {b.fromCity} → {b.toCity}
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${busTypeColor(b.busType)}`}>
                    {b.busType}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock size={9} /> {b.duration}
                  </span>
                  <span className="text-xs font-bold text-gray-700">Rs. {b.price.toLocaleString()}</span>
                </div>
                {b.bestSeller && (
                  <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                    ⭐ Best Seller
                  </span>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400">
              <Bus size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No buses found</p>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{buses.length}</span> buses
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusList;