import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, X, Bus, SlidersHorizontal, Star } from "lucide-react";
import BusCard from '../components/BusCard';
import { useAppContext } from "../context/Context";

const unique = (arr) => [...new Set(arr)];

const Buses = () => {

  const { webBuses : buses } = useAppContext()
  const [searchParams] = useSearchParams();

  const [search,         setSearch]         = useState(searchParams.get('from') || '');
  const [fromCity,       setFromCity]       = useState(searchParams.get('from') || 'All');
  const [toCity,         setToCity]         = useState(searchParams.get('to')   || 'All');
  const [date,           setDate]           = useState(searchParams.get('date') || '');
  const [busType,        setBusType]        = useState('All');
  const [maxPrice,       setMaxPrice]       = useState(searchParams.get('maxPrice') || '');
  const [onlyBestSeller, setOnlyBestSeller] = useState(false);
  const [showFilters,    setShowFilters]    = useState(false);

  const fromCities = ['All', ...unique(buses?.map(b => b.fromCity))];
  const toCities   = ['All', ...unique(buses?.map(b => b.toCity))];
  const busTypes   = ['All', 'AC', 'Non-AC', 'Sleeper', 'Mini'];

  const filtered = useMemo(() => {
    return buses?.filter(bus => {
      const q = search.toLowerCase();
      const matchSearch  = !q || bus.busName.toLowerCase().includes(q) || bus.fromCity.toLowerCase().includes(q) || bus.toCity.toLowerCase().includes(q);
      const matchFrom    = fromCity === 'All' || bus.fromCity === fromCity;
      const matchTo      = toCity   === 'All' || bus.toCity   === toCity;
      const matchDate    = !date    || bus.date === date;
      const matchPrice   = !maxPrice|| bus.price <= Number(maxPrice);
      const matchSeller  = !onlyBestSeller || bus.bestSeller === true;  
      const matchType    = busType  === 'All' || (bus.busType && bus.busType === busType);
      return matchSearch && matchFrom && matchTo && matchDate && matchPrice && matchSeller && matchType;
    });
  }, [search, fromCity, toCity, date, busType, maxPrice, onlyBestSeller]);

  const clearFilters = () => {
    setSearch(''); setFromCity('All'); setToCity('All');
    setDate(''); setBusType('All'); setMaxPrice(''); setOnlyBestSeller(false);
  };

  const hasActiveFilters = search || fromCity !== 'All' || toCity !== 'All' || date || busType !== 'All' || maxPrice || onlyBestSeller;

  return (
    <div className="min-h-screen bg-gray-50">

  
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white overflow-hidden pt-20">
        
     
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14 text-center">
          
        
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Bus size={15} />
            Pakistan's Trusted Bus Booking
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Available <span className="text-yellow-300">Buses</span>
          </h1>
          <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">
            Find & book your perfect journey across Pakistan — fast, easy, affordable.
          </p>

     
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/30">
              <Search size={20} className="ml-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by bus name, from city, or to city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-4 text-gray-800 text-base focus:outline-none placeholder:text-gray-400"
              />
              {search ? (
                <button
                  onClick={() => setSearch('')}
                  className="mr-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
                >
                  <X size={16} />
                </button>
              ) : (
                <span className="mr-4 text-xs text-gray-300 hidden sm:block">Press Enter</span>
              )}
            </div>
          
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Multan'].map(city => (
                <button
                  key={city}
                  onClick={() => setSearch(city)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition
                    ${search === city
                      ? 'bg-white text-primary border-white'
                      : 'bg-white/10 text-white border-white/25 hover:bg-white/20'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-6xl mx-auto px-4 py-8">

        
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <p className="text-gray-600 font-medium">
            <span className="text-primary font-bold text-lg">{filtered.length}</span>{' '}
            bus{filtered.length !== 1 ? 'es' : ''} found
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition">
                <X size={16} /> Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition
                ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'}`}
            >
              <SlidersHorizontal size={16} /> Filters
              {hasActiveFilters && (
                <span className="bg-white text-primary rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">!</span>
              )}
            </button>
          </div>
        </div>

    
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">From</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select value={fromCity} onChange={e => setFromCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-white">
                  {fromCities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">To</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select value={toCity} onChange={e => setToCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-white">
                  {toCities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Bus Type</label>
              <select value={busType} onChange={e => setBusType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                {busTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Max Price (Rs.)</label>
              <input type="number" placeholder="e.g. 3000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" /> Best Seller
              </label>
              <button onClick={() => setOnlyBestSeller(!onlyBestSeller)}
                className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-200 ${onlyBestSeller ? 'bg-primary' : 'bg-gray-200'}`}>
                <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${onlyBestSeller ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        )}

      
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filtered.map(bus => <BusCard key={bus._id} bus={bus} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4"><Bus size={48} className="text-primary" /></div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No buses found</h3>
            <p className="text-gray-500 max-w-sm">Try adjusting your filters or search query.</p>
            <button onClick={clearFilters} className="mt-5 bg-primary text-white px-6 py-2.5 rounded-lg hover:scale-105 transition font-medium">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buses;