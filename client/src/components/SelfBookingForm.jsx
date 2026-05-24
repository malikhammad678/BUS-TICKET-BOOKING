import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, MapPin, Calendar, Clock, DollarSign, ChevronRight, AlertCircle, X, TrendingUp } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 🆕 Route-based price calculation (per km rate)
const calculatePrice = (fromCity, toCity, busType) => {
  // Distance mapping (in km) - approximate distances between Pakistani cities
  const distances = {
    // Major routes
    "Karachi-Lahore": 1200,
    "Lahore-Karachi": 1200,
    "Karachi-Islamabad": 1400,
    "Islamabad-Karachi": 1400,
    "Lahore-Islamabad": 380,
    "Islamabad-Lahore": 380,
    "Karachi-Peshawar": 1500,
    "Peshawar-Karachi": 1500,
    "Lahore-Peshawar": 520,
    "Peshawar-Lahore": 520,
    "Islamabad-Peshawar": 180,
    "Peshawar-Islamabad": 180,
    "Karachi-Multan": 900,
    "Multan-Karachi": 900,
    "Lahore-Multan": 350,
    "Multan-Lahore": 350,
    "Islamabad-Multan": 550,
    "Multan-Islamabad": 550,
    "Karachi-Quetta": 700,
    "Quetta-Karachi": 700,
    "Lahore-Quetta": 1000,
    "Quetta-Lahore": 1000,
    "Karachi-Hyderabad": 160,
    "Hyderabad-Karachi": 160,
    "Lahore-Faisalabad": 140,
    "Faisalabad-Lahore": 140,
    "Islamabad-Rawalpindi": 20,
    "Rawalpindi-Islamabad": 20,
  };
  
  // Create route key
  const routeKey = `${fromCity}-${toCity}`;
  let distance = distances[routeKey] || 500; // Default 500km if not found
  
  // Price per km based on bus type
  const rates = {
    "AC": 15,      // Rs. 15 per km
    "Non-AC": 10,  // Rs. 10 per km
    "Sleeper": 20, // Rs. 20 per km
    "Mini": 8      // Rs. 8 per km
  };
  
  const rate = rates[busType] || 12;
  const calculatedPrice = Math.ceil(distance * rate);
  
  // Round to nearest 50
  return Math.ceil(calculatedPrice / 50) * 50;
};

// City suggestions
const popularCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar", 
  "Multan", "Faisalabad", "Quetta", "Hyderabad", "Gujranwala",
  "Sialkot", "Bahawalpur", "Sukkur", "Larkana", "Mardan"
];

const SelfBookingForm = ({ onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    date: "",
    departureTime: "",
    busType: "AC",
    busName: ""
  });
  
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Auto-calculate price when fromCity, toCity, or busType changes
  useEffect(() => {
    if (formData.fromCity && formData.toCity && formData.fromCity !== formData.toCity) {
      const price = calculatePrice(formData.fromCity, formData.toCity, formData.busType);
      setCalculatedPrice(price);
    } else {
      setCalculatedPrice(0);
    }
  }, [formData.fromCity, formData.toCity, formData.busType]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFromCityChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, fromCity: value });
    if (value.length > 1) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered.slice(0, 5));
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };
  
  const handleToCityChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, toCity: value });
    if (value.length > 1) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered.slice(0, 5));
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };
  
  const selectFromCity = (city) => {
    setFormData({ ...formData, fromCity: city });
    setShowFromSuggestions(false);
  };
  
  const selectToCity = (city) => {
    setFormData({ ...formData, toCity: city });
    setShowToSuggestions(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fromCity || !formData.toCity || !formData.date || !formData.departureTime) {
      setError("Please fill all required fields");
      return;
    }
    
    if (formData.fromCity === formData.toCity) {
      setError("From and To cities cannot be the same");
      return;
    }
    
    if (formData.date < today) {
      setError("Please select a future date");
      return;
    }
    
    if (calculatedPrice <= 0) {
      setError("Unable to calculate price. Please check route.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/self-booking/create-trip`,
        {
          ...formData,
          price: calculatedPrice
        },
        { headers: { token } }
      );
      
      if (data.success) {
        // ✅ Close the modal first
        onClose();
        // ✅ Then navigate to seat selection
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
  
  // Get price range suggestion
  const getPriceInfo = () => {
    if (!formData.fromCity || !formData.toCity) return null;
    if (formData.fromCity === formData.toCity) return null;
    
    const prices = {
      "AC": calculatePrice(formData.fromCity, formData.toCity, "AC"),
      "Non-AC": calculatePrice(formData.fromCity, formData.toCity, "Non-AC"),
      "Sleeper": calculatePrice(formData.fromCity, formData.toCity, "Sleeper"),
      "Mini": calculatePrice(formData.fromCity, formData.toCity, "Mini")
    };
    
    return (
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
        <TrendingUp size={12} className="text-primary" />
        <span>Price estimates: </span>
        <span className="font-medium">AC: Rs.{prices.AC}</span>
        <span className="font-medium">Non-AC: Rs.{prices["Non-AC"]}</span>
        <span className="font-medium">Sleeper: Rs.{prices.Sleeper}</span>
        <span className="font-medium">Mini: Rs.{prices.Mini}</span>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {/* From City */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">From City *</label>
            <div className="relative">
              <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="fromCity"
                placeholder="e.g., Karachi, Lahore, Islamabad"
                value={formData.fromCity}
                onChange={handleFromCityChange}
                onFocus={() => formData.fromCity && setShowFromSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
                autoComplete="off"
              />
            </div>
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                {fromSuggestions.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectFromCity(city)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-primary" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* To City */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">To City *</label>
            <div className="relative">
              <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                name="toCity"
                placeholder="e.g., Karachi, Lahore, Islamabad"
                value={formData.toCity}
                onChange={handleToCityChange}
                onFocus={() => formData.toCity && setShowToSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
                autoComplete="off"
              />
            </div>
            {showToSuggestions && toSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                {toSuggestions.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectToCity(city)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-primary" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Travel Date *</label>
              <div className="relative">
                <Calendar size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
            
            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Departure Time *</label>
              <div className="relative">
                <Clock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bus Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Bus Category *</label>
              <select
                name="busType"
                value={formData.busType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                <option value="AC">✨ AC Bus (Luxury)</option>
                <option value="Non-AC">🌬️ Non-AC Bus (Economy)</option>
                <option value="Sleeper">🛌 Sleeper Bus (Premium)</option>
                <option value="Mini">🚐 Mini Bus (Shuttle)</option>
              </select>
            </div>
            
            {/* Bus Name (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Bus Name (Optional)</label>
              <div className="relative">
                <Bus size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  name="busName"
                  placeholder="e.g., Daewoo Express, Faisal Movers"
                  value={formData.busName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
          
          {/* Price Display */}
          {formData.fromCity && formData.toCity && formData.fromCity !== formData.toCity && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Estimated Fare</p>
                  <p className="text-2xl font-bold text-primary">Rs. {calculatedPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">per seat (including taxes)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Based on distance</p>
                  <p className="text-xs text-gray-400">{formData.fromCity} → {formData.toCity}</p>
                </div>
              </div>
              {getPriceInfo()}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || calculatedPrice === 0}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating Trip...</>
            ) : (
              <>Continue to Select Seats <ChevronRight size={18} /></>
            )}
          </button>
          
          <p className="text-xs text-gray-400 text-center">
            💡 Price automatically calculated based on route distance and bus category
          </p>
        </form>
      </div>
    </div>
  );
};

export default SelfBookingForm;