import { useState } from "react";
import { Users2, Search, Trash2, ShieldOff, ShieldCheck } from "lucide-react";
import { useAppContext } from "../../context/Context";

const ManageallUsers = () => {
  const { allUsers, updateUserStatus, deleteUser } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "active" && !u.isBlocked) ||
      (activeFilter === "blocked" && u.isBlocked);
    return matchSearch && matchFilter;
  });

  const handleToggleBlock = (id) => updateUserStatus(id);
  const handleDelete = (id) => deleteUser(id);

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">Manage Users</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{allUsers.length} registered Users</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full border bg-green-100 text-green-600 border-green-200">
            {allUsers.filter((u) => !u.isBlocked).length} Active
          </span>
          <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full border bg-red-50 text-red-500 border-red-200">
            {allUsers.filter((u) => u.isBlocked).length} Blocked
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Search + Filter */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex flex-col gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
            {["All", "active", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex-1 capitalize
                  ${activeFilter === f ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold">User</th>
                <th className="px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Bookings</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/70 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-extrabold uppercase">{u.name?.charAt(0)}</span>
                      </div>
                      <p className="font-bold text-gray-800">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-500 text-sm">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">{u?.bookings?.length}</span>
                      </div>
                      <span className="text-xs text-gray-400">bookings</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer
                          ${!u.isBlocked ? "bg-yellow-50 hover:bg-yellow-100 border-yellow-100 text-yellow-500" : "bg-green-50 hover:bg-green-100 border-green-100 text-green-500"}`}
                        title={u.isBlocked ? "Unblock" : "Block"}
                      >
                        {u.isBlocked ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-400 transition-all cursor-pointer" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <Users2 size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No Users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-50">
          {filtered.length > 0 ? filtered.map((u) => (
            <div key={u._id} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-extrabold uppercase">{u.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">{u.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleBlock(u._id)}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer
                    ${!u.isBlocked ? "bg-yellow-50 border-yellow-100 text-yellow-500" : "bg-green-50 border-green-100 text-green-500"}`}
                >
                  {u.isBlocked ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                </button>
                <button onClick={() => handleDelete(u._id)} className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400">
              <Users2 size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No Users found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-600">{allUsers.length}</span> Users
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageallUsers;