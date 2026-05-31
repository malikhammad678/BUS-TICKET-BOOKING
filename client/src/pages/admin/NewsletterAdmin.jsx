import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Trash2, Search, Download, Users, CalendarDays, RefreshCw } from "lucide-react";
import { useAppContext } from "../../context/Context";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NewsletterAdmin = () => {

    const {adminToken} = useAppContext()

  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/newsletter/get-email`);
      if (data.success) setEmails(data.emails);
      else toast.error("You have no Emails yet!");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to remove this email!")) return;
    setDeleting(id);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/newsletter/delete-email/${id}`, {} ,{headers:{token:adminToken}});
      if (data.success) {
        toast.success("Subscriber removed");
        fetchEmails()
      } else {
        toast.error(data.message || "Something Went Wrong");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setDeleting(null);
    }
  };

  const exportCSV = () => {
    const rows = ["Email,Joined"].concat(
      emails.map((e) => `${e.content},${new Date(e.createdAt).toLocaleDateString()}`)
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = emails.filter((e) =>
    e.content?.toLowerCase().includes(search.toLowerCase())
  );

  const thisMonth = emails.filter((e) => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const getInitials = (email = "") => email.slice(0, 2).toUpperCase();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
  ];

  const getColor = (email = "") =>
    avatarColors[email.charCodeAt(0) % avatarColors.length];

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all subscribed emails</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchEmails}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={emails.length === 0}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition disabled:opacity-40"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-gray-800">{emails.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
            <CalendarDays size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">This Month</p>
            <p className="text-2xl font-bold text-gray-800">{thisMonth}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <Mail size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Latest</p>
            <p className="text-sm font-semibold text-gray-700 truncate max-w-[130px]">
              {emails.length > 0
                ? new Date(
                    Math.max(...emails.map((e) => new Date(e.createdAt)))
                  ).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-4 shadow-sm">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Mail size={36} className="mb-3 opacity-30" />
            <p className="text-sm">
              {search ? "No Email Found!" : "No Emails Yet!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Subscriber
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((email, i) => (
                  <tr key={email._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getColor(email.content)}`}
                        >
                          {getInitials(email.content)}
                        </div>
                        <span className="font-medium text-gray-700 truncate max-w-[120px]">
                          {email.content?.split("@")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{email.content}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(email.createdAt).toLocaleDateString("en-PK", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(email._id)}
                        disabled={deleting === email._id}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                        {deleting === email._id ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          {filtered.length} of {emails.length} subscribers shown
        </p>
      )}
    </div>
  );
};

export default NewsletterAdmin;