import { useState } from "react";
import { Bus, MapPin, Clock, Calendar, DollarSign, Tag, Image, Star, ArrowRight, Upload } from "lucide-react";
import { useAppContext } from "../../context/Context";

const busTypes = ["AC", "Non-AC", "Sleeper", "Mini"];

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi",
  "Peshawar", "Quetta", "Multan", "Faisalabad",
  "Hyderabad", "Sialkot"
];

const InputWrapper = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
      )}
      {children}
    </div>
  </div>
);

const inputClass = "w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder-gray-400";
const selectClass = "w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none cursor-pointer";

const AddBus = () => {

  const { addNewBus, loading } = useAppContext()

  const [form, setForm] = useState({
    busName: "",
    fromCity: "",
    toCity: "",
    price: "",
    departureTime: "",
    date: "",
    duration: "",
    busType: "",
    image: null,
    bestSeller: false,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewBus(form)
  };

  return (
    <div className="max-w-3xl">


      <div className="mb-6">
        <div className="flex items-start gap-2 mb-1">
    
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Add New Bus</h1>
        </div>
        <p className="text-sm text-gray-400">Fill in the details to add a new bus to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

  
        <div className="bg-white rounded-2xl border border-gray-100 shadow-0 p-5">
          <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Bus Image</h2>
          <label className="cursor-pointer block">
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            {preview ? (
              <div className="relative group rounded-xl overflow-hidden h-44 border border-gray-200">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                  <p className="text-white text-sm font-semibold">Click to change</p>
                </div>
              </div>
            ) : (
              <div className="h-44 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Upload size={18} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">Click to upload bus image</p>
                <p className="text-xs text-gray-300">PNG, JPG up to 5MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-0 p-5">
          <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <InputWrapper label="Bus Name" icon={Bus}>
              <input
                name="busName"
                value={form.busName}
                onChange={handleChange}
                placeholder="e.g. Daewoo Express"
                required
                className={inputClass}
              />
            </InputWrapper>

            <InputWrapper label="Bus Type" icon={Tag}>
              <select name="busType" value={form.busType} onChange={handleChange} required className={selectClass}>
                <option value="">Select type</option>
                {busTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </InputWrapper>

          </div>
        </div>

        {/* Route */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-0 p-5">
          <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Route Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <InputWrapper label="From City" icon={MapPin}>
              <select name="fromCity" value={form.fromCity} onChange={handleChange} required className={selectClass}>
                <option value="">Select city</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputWrapper>

            <InputWrapper label="To City" icon={MapPin}>
              <select name="toCity" value={form.toCity} onChange={handleChange} required className={selectClass}>
                <option value="">Select city</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputWrapper>

          </div>

          {/* Arrow between cities */}
          {form.fromCity && form.toCity && (
            <div className="mt-3 flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
              <span className="text-sm font-semibold text-primary">{form.fromCity}</span>
              <ArrowRight size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">{form.toCity}</span>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-0 p-5">
          <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <InputWrapper label="Date" icon={Calendar}>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </InputWrapper>

            <InputWrapper label="Departure Time" icon={Clock}>
              <input
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM"
                required
                className={inputClass}
              />
            </InputWrapper>

            <InputWrapper label="Duration" icon={Clock}>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 16h"
                required
                className={inputClass}
              />
            </InputWrapper>

          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-0 p-5">
          <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Pricing & Tags</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">

            <InputWrapper label="Price (PKR)" icon={DollarSign}>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 3500"
                required
                className={inputClass}
              />
            </InputWrapper>

            {/* Best Seller Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Best Seller
              </label>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, bestSeller: !p.bestSeller }))}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${form.bestSeller
                    ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
              >
                <Star size={16} className={form.bestSeller ? "fill-yellow-400 text-yellow-400" : ""} />
                {form.bestSeller ? "Marked as Best Seller" : "Mark as Best Seller"}
              </button>
            </div>

          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <Bus size={17} />
          {
            loading ? 'Adding...' : 'Add Bus'
          }
        </button>

      </form>
    </div>
  );
};

export default AddBus;