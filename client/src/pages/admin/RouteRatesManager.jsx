import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, Save, X, MapPin, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/Context";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EMPTY_FORM = {
  fromCity: "", toCity: "", distanceKm: "",
  rates: { AC: 15, "Non-AC": 10, Sleeper: 20, Mini: 8 }
};

const RouteRatesManager = () => {
  const { adminToken } = useAppContext();
  const headers = { token: adminToken };

  const [routes, setRoutes]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const fetchRoutes = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/owner/route-rates`, { headers });
      if (data.success) setRoutes(data.routes);
    } catch { toast.error("Routes load nahi hui"); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleRateChange = (busType, value) =>
    setForm(p => ({ ...p, rates: { ...p.rates, [busType]: Number(value) } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromCity || !form.toCity || !form.distanceKm) {
      toast.error("Sab fields fill karein"); return;
    }
    setLoading(true);
    try {
      if (editingId) {
        const { data } = await axios.put(
          `${BACKEND_URL}/owner/route-rates/${editingId}`,
          { distanceKm: Number(form.distanceKm), rates: form.rates },
          { headers }
        );
        if (data.success) { toast.success("Route updated!"); resetForm(); fetchRoutes(); }
      } else {
        const { data } = await axios.post(
          `${BACKEND_URL}/owner/route-rates`,
          { ...form, distanceKm: Number(form.distanceKm) },
          { headers }
        );
        if (data.success) { toast.success("Route Added!"); resetForm(); fetchRoutes(); }
        else toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do You Want To Remove This Route?")) return;
    try {
      const { data } = await axios.delete(`${BACKEND_URL}/owner/route-rates/${id}`, { headers });
      if (data.success) { toast.success("Route deleted"); fetchRoutes(); }
    } catch { toast.error("Delete nahi hua"); }
  };

  const startEdit = (route) => {
    setForm({
      fromCity: route.fromCity, toCity: route.toCity,
      distanceKm: route.distanceKm, rates: { ...route.rates }
    });
    setEditingId(route._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(false); };

  const toggleActive = async (route) => {
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/owner/route-rates/${route._id}`,
        { isActive: !route.isActive },
        { headers }
      );
      if (data.success) { toast.success(data.message); fetchRoutes(); }
    } catch { toast.error("Not Updated"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Route Rates Manager</h2>
        <button
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Route"}
        </button>
      </div>

  
      {showForm && (
        <form onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "✏️ Update Route" : "➕ Add New Route"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">From City</label>
              <input type="text" placeholder="e.g., Karachi"
                value={form.fromCity}
                onChange={e => setForm(p => ({ ...p, fromCity: e.target.value }))}
                disabled={!!editingId}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50"
                required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">To City</label>
              <input type="text" placeholder="e.g., Lahore"
                value={form.toCity}
                onChange={e => setForm(p => ({ ...p, toCity: e.target.value }))}
                disabled={!!editingId}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50"
                required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Distance (km)
              </label>
              <input type="number" placeholder="e.g., 1200" min="1"
                value={form.distanceKm}
                onChange={e => setForm(p => ({ ...p, distanceKm: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
              Per-km Rate (Rs.)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["AC", "Non-AC", "Sleeper", "Mini"].map(type => (
                <div key={type}>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {type === "AC" ? "✨ AC" : type === "Non-AC" ? "🌬️ Non-AC"
                      : type === "Sleeper" ? "🛌 Sleeper" : "🚐 Mini"}
                  </label>
                  <input type="number" min="1" step="0.5"
                    value={form.rates[type]}
                    onChange={e => handleRateChange(type, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {form.distanceKm && (
                    <p className="text-xs text-primary mt-1">
                      ≈ Rs. {Math.ceil(Math.ceil(Number(form.distanceKm) * form.rates[type]) / 50) * 50}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : editingId ? "Update Route" : "Add Route"}
            </button>
            <button type="button" onClick={resetForm}
              className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Route</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Distance</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">AC</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Non-AC</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Sleeper</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Mini</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                    No Route yet. Get Stared with "Add Route".
                  </td>
                </tr>
              ) : routes.map(route => (
                <tr key={route._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">
                    {route.fromCity} → {route.toCity}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{route.distanceKm} km</td>
                  <td className="px-4 py-3 text-gray-600">
                    Rs.{Math.ceil(Math.ceil(route.distanceKm * route.rates.AC) / 50) * 50}
                    <span className="text-xs text-gray-400 ml-1">({route.rates.AC}/km)</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Rs.{Math.ceil(Math.ceil(route.distanceKm * route.rates["Non-AC"]) / 50) * 50}
                    <span className="text-xs text-gray-400 ml-1">({route.rates["Non-AC"]}/km)</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Rs.{Math.ceil(Math.ceil(route.distanceKm * route.rates.Sleeper) / 50) * 50}
                    <span className="text-xs text-gray-400 ml-1">({route.rates.Sleeper}/km)</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Rs.{Math.ceil(Math.ceil(route.distanceKm * route.rates.Mini) / 50) * 50}
                    <span className="text-xs text-gray-400 ml-1">({route.rates.Mini}/km)</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(route)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        route.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {route.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(route)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(route._id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteRatesManager;