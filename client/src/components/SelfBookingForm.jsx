import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus, MapPin, Calendar, Clock, ChevronRight,
  AlertCircle, X, TrendingUp, Loader2
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const popularCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar",
  "Multan", "Faisalabad", "Quetta", "Hyderabad", "Gujranwala",
  "Sialkot", "Bahawalpur", "Sukkur", "Larkana", "Mardan"
];

const SelfBookingForm = ({ onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    fromCity: "", toCity: "", date: "",
    departureTime: "", busType: "AC", busName: ""
  });

  const [priceData, setPriceData] = useState(null);      // { price, allPrices, distanceKm }
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError]   = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions]     = useState([]);
  const [showFromSug, setShowFromSug] = useState(false);
  const [showToSug,   setShowToSug]   = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ─── Fetch price from backend whenever route/busType changes ───
  const fetchPrice = useCallback(async (from, to, busType) => {
    if (!from || !to || from === to) {
      setPriceData(null);
      setPriceError("");
      return;
    }

    setPriceLoading(true);
    setPriceError("");

    try {
      const { data } = await axios.get(`${BACKEND_URL}/owner/calculate-price`, {
        params: { fromCity: from, toCity: to, busType }
      });

      if (data.success) {
        setPriceData(data);
        setPriceError("");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Route not found";
      setPriceData(null);
      setPriceError(msg === "Route not configured by admin"
        ? `⚠️ ${from} → ${to} Route is not setted by Admin!`
        : msg
      );
    } finally {
      setPriceLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPrice(formData.fromCity, formData.toCity, formData.busType);
    }, 400); 
    return () => clearTimeout(timeout);
  }, [formData.fromCity, formData.toCity, formData.busType, fetchPrice]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCityChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    const filtered = popularCities
      .filter(c => c.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
    if (field === "fromCity") { setFromSuggestions(filtered); setShowFromSug(value.length > 1); }
    else                       { setToSuggestions(filtered);   setShowToSug(value.length > 1);   }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fromCity || !formData.toCity || !formData.date || !formData.departureTime) {
      setError("Please fill all required fields"); return;
    }
    if (formData.fromCity === formData.toCity) {
      setError("From aur To city same nahi ho sakti"); return;
    }
    if (formData.date < today) {
      setError("Please select a future date"); return;
    }
    if (!priceData?.price) {
      setError("Price calculate nahi hua. Route check karein."); return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/self-booking/create-trip`,
        { ...formData, price: priceData.price },
        { headers: { token } }
      );
      if (data.success) {
        onClose();
        navigate(`/self-booking/seats/${data.tempBusId}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const calculatedPrice = priceData?.price || 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bus size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Create Your Own Trip</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* From City */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              From City *
            </label>
            <div className="relative">
              <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="fromCity"
                placeholder="e.g., Karachi, Lahore"
                value={formData.fromCity}
                onChange={e => handleCityChange("fromCity", e.target.value)}
                onFocus={() => formData.fromCity && setShowFromSug(true)}
                onBlur={() => setTimeout(() => setShowFromSug(false), 150)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                required autoComplete="off"
              />
            </div>
            {showFromSug && fromSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                {fromSuggestions.map(city => (
                  <button key={city} type="button"
                    onMouseDown={() => { setFormData(p => ({ ...p, fromCity: city })); setShowFromSug(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-primary" /> {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              To City *
            </label>
            <div className="relative">
              <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="toCity"
                placeholder="e.g., Islamabad, Peshawar"
                value={formData.toCity}
                onChange={e => handleCityChange("toCity", e.target.value)}
                onFocus={() => formData.toCity && setShowToSug(true)}
                onBlur={() => setTimeout(() => setShowToSug(false), 150)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                required autoComplete="off"
              />
            </div>
            {showToSug && toSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                {toSuggestions.map(city => (
                  <button key={city} type="button"
                    onMouseDown={() => { setFormData(p => ({ ...p, toCity: city })); setShowToSug(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-primary" /> {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Travel Date *
              </label>
              <div className="relative">
                <Calendar size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input type="date" name="date" min={today} value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Departure Time *
              </label>
              <div className="relative">
                <Clock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input type="time" name="departureTime" value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Bus Category *
              </label>
              <select name="busType" value={formData.busType} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                <option value="AC">✨ AC Bus (Luxury)</option>
                <option value="Non-AC">🌬️ Non-AC Bus (Economy)</option>
                <option value="Sleeper">🛌 Sleeper Bus (Premium)</option>
                <option value="Mini">🚐 Mini Bus (Shuttle)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Bus Name (Optional)
              </label>
              <div className="relative">
                <Bus size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input type="text" name="busName" placeholder="e.g., Daewoo Express"
                  value={formData.busName} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>

          {formData.fromCity && formData.toCity && formData.fromCity !== formData.toCity && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 min-h-[90px]">
              {priceLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 size={18} className="animate-spin text-primary" />
                  <span className="text-sm">Price calculate ho raha hai...</span>
                </div>
              ) : priceError ? (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle size={16} /> {priceError}
                </div>
              ) : priceData ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Fare</p>
                      <p className="text-2xl font-bold text-primary">
                        Rs. {calculatedPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">per seat (including taxes)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{priceData.distanceKm} km</p>
                      <p className="text-xs text-gray-400">
                        {formData.fromCity} → {formData.toCity}
                      </p>
                    </div>
                  </div>
                  {priceData.allPrices && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <TrendingUp size={12} className="text-primary" />
                      <span>Estimates:</span>
                      {Object.entries(priceData.allPrices).map(([type, price]) => (
                        <span key={type} className={`font-medium ${formData.busType === type ? "text-primary" : ""}`}>
                          {type}: Rs.{price}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !priceData?.price}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Creating Trip...</>
            ) : (
              <>Continue to Select Seats <ChevronRight size={18} /></>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            💡Price is calculated automatically based on the routes and rates set by the admin.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SelfBookingForm;