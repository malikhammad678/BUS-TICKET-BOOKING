import { MessageSquare, Search, Trash2, Eye, X, Mail, Phone, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/Context";

const ManageMessages = () => {
  const { messages, deleteMessages, getMessages } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const deleteMessage = (id) => deleteMessages(id);

  const handleRefresh = async () => {
  setLoading(true);
  await getMessages();
  setLoading(false);
};

  const filtered = messages?.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-5">

     <div className="flex items-center justify-between gap-3">
  <div>
    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">Manage Messages</h1>
    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{messages?.length} total messages</p>
  </div>
  <div className="flex items-center gap-2 shrink-0">
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
    >
      <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
      Refresh
    </button>
    <span className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-full border bg-blue-50 text-blue-500 border-blue-200">
      {messages.length} Inbox
    </span>
  </div>
</div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold">#</th>
                <th className="px-5 py-3 text-left font-semibold">Sender</th>
                <th className="px-5 py-3 text-left font-semibold">Contact</th>
                <th className="px-5 py-3 text-left font-semibold">Message</th>
                <th className="px-5 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((m, i) => (
                <tr key={m._id} className="hover:bg-gray-50/70 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{i + 1}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-extrabold uppercase">{m.firstName?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{m.firstName} {m.lastName}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Phone size={11} className="text-primary shrink-0" />
                      {m.phone || <span className="text-gray-300">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-[200px]">
                    <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{m.message}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setSelected(m)} className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-400 transition-all cursor-pointer" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => deleteMessage(m._id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-400 transition-all cursor-pointer" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No messages found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-50">
          {filtered.length > 0 ? filtered.map((m) => (
            <div key={m._id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-extrabold uppercase">{m.firstName?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{m.firstName} {m.lastName}</p>
                    <p className="text-[10px] text-gray-400">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setSelected(m)} className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 cursor-pointer">
                    <Eye size={13} />
                  </button>
                  <button onClick={() => deleteMessage(m._id)} className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{m.message}</p>
              <p className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</p>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No messages found</p>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-600">{messages.length}</span> messages
          </p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 space-y-4 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all cursor-pointer">
              <X size={14} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                <span className="text-white text-lg font-extrabold uppercase">{selected.firstName?.charAt(0)}</span>
              </div>
              <div>
                <h2 className="font-extrabold text-gray-800 text-base">{selected.firstName} {selected.lastName}</h2>
                <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-3 flex items-center gap-2">
                <Mail size={13} className="text-primary shrink-0" />
                <p className="text-xs text-gray-600 truncate">{selected.email}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-3 flex items-center gap-2">
                <Phone size={13} className="text-primary shrink-0" />
                <p className="text-xs text-gray-600">{selected.phone || "—"}</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
            </div>
            <button
              onClick={() => { deleteMessage(selected._id); setSelected(null); }}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 size={14} /> Delete Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;