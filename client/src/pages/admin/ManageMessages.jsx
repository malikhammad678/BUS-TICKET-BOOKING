import { MessageSquare, Search, Trash2, Eye, X, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/Context";

const demoMessages = [
  {
    _id: "1",
    firstName: "Ali",
    lastName: "Hassan",
    email: "ali@gmail.com",
    phone: "0300-1234567",
    message: "I wanted to ask about the Karachi to Lahore route timings and seat availability for next weekend.",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    firstName: "Sara",
    lastName: "Khan",
    email: "sara.khan@email.com",
    phone: "0321-9876543",
    message: "My booking was cancelled but the amount has not been refunded yet. Please look into this matter urgently.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "3",
    firstName: "Usman",
    lastName: "Tariq",
    email: "usman.t@mail.com",
    phone: "",
    message: "Can you add more buses on the Islamabad to Peshawar route? There are never enough seats available.",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "4",
    firstName: "Fatima",
    lastName: "Malik",
    email: "fatima.m@web.com",
    phone: "0333-5556677",
    message: "Great service overall! The staff was very helpful and the bus was on time. Will definitely book again.",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];


const ManageMessages = () => {
  const { messages, deleteMessages } = useAppContext();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const deleteMessage = (id) => {
       deleteMessages(id)
  }
   

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
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
            Manage Messages
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {messages?.length} total messages
          </p>
        </div>

        {/* Quick stat */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-blue-50 text-blue-500 border-blue-200">
            {messages.length} Inbox
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Search bar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold">#</th>
                <th className="px-5 py-3 text-left font-semibold">Sender</th>
                <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Contact</th>
                <th className="px-5 py-3 text-left font-semibold">Message</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((m, i) => (
                  <tr
                    key={m._id}
                    className="hover:bg-gray-50/70 transition-colors duration-150"
                  >
                    {/* Index */}
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                        {i + 1}
                      </span>
                    </td>

                    {/* Sender */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-extrabold uppercase">
                            {m.firstName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {m.firstName} {m.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{m.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Phone size={11} className="text-primary shrink-0" />
                        {m.phone || <span className="text-gray-300">—</span>}
                      </div>
                    </td>

                    {/* Message preview */}
                    <td className="px-5 py-3.5 max-w-[220px]">
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {m.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelected(m)}
                          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-400 transition-all cursor-pointer"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
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

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600">{messages.length}</span>{" "}
            messages
          </p>
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                <span className="text-white text-lg font-extrabold uppercase">
                  {selected.firstName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="font-extrabold text-gray-800 text-base">
                  {selected.firstName} {selected.lastName}
                </h2>
                <p className="text-xs text-gray-400">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Mail size={13} className="text-primary shrink-0" />
                <p className="text-xs text-gray-600 truncate">{selected.email}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Phone size={13} className="text-primary shrink-0" />
                <p className="text-xs text-gray-600">
                  {selected.phone || "—"}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Message
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selected.message}
              </p>
            </div>

            {/* Delete from modal */}
            <button
              onClick={() => {
                deleteMessage(selected._id);
                setSelected(null);
              }}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              Delete Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;