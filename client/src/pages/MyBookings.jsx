import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus, Calendar, Clock, MapPin, Download, Ticket,
  CheckCircle, XCircle, AlertCircle, ChevronRight, Search, X, Loader2, Armchair
} from "lucide-react";
import { useAppContext } from "../context/Context";

const statusConfig = {
  confirmed: {
    icon: <CheckCircle size={14} />,
    bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500",
    label: "Confirmed"
  },
  pending: {
    icon: <AlertCircle size={14} />,
    bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500",
    label: "Pending"
  },
  cancelled: {
    icon: <XCircle size={14} />,
    bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500",
    label: "Cancelled"
  },
};

const PrintTicket = ({ booking, ticketRef }) => {
  // Support both regular booking and self booking
  const fromCity = booking.fromCity || booking.bus?.fromCity || "";
  const toCity = booking.toCity || booking.bus?.toCity || "";
  const busName = booking.bus?.busName || booking.busName || "Private Trip";
  const busType = booking.bus?.busType || booking.busType || "AC";
  const date = booking.date || booking.bus?.date || "—";
  const departureTime = booking.departureTime || booking.bus?.departureTime || "";
  const duration = booking.bus?.duration || booking.duration || "2h 30m";
  const price = booking.price || booking.bus?.price || 0;
  const selectedSeats = booking.selectedSeats || [];

  return (
    <div
      ref={ticketRef}
      style={{
        position: 'fixed', left: '-9999px', top: 0,
        width: '600px', background: '#fff', fontFamily: 'sans-serif',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)'
      }}
    >
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', padding: '28px 32px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, letterSpacing: 2 }}>BUS TICKET</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{fromCity} → {toCity}</h1>
            <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: 14 }}>{busName} · {busType}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>BOOKING ID</p>
            <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>{booking.bookingId}</p>
            <div style={{
              background: '#22c55e', borderRadius: 8, padding: '6px 14px', marginTop: 8,
              fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: '#fff',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 14 }}>✔</span> {booking.bookingStatus?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: '#f8f7ff' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', marginLeft: -10, flexShrink: 0 }} />
        <div style={{ flex: 1, borderTop: '2px dashed #d8b4fe', margin: '0 8px' }} />
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', marginRight: -10, flexShrink: 0 }} />
      </div>

      <div style={{ padding: '24px 32px', background: '#f8f7ff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: 20 }}>
          {[
            { label: 'PASSENGER', value: booking.passengerName },
            { label: 'GENDER', value: booking.gender },
            { label: 'PHONE', value: booking.phone },
            { label: 'SEATS', value: selectedSeats.length > 0 ? selectedSeats.join(", ") : "—" },
            { label: 'DEPARTURE DATE', value: date },
            { label: 'DEPARTURE TIME', value: departureTime },
            { label: 'DURATION', value: duration },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #e9d5ff', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>CNIC</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', margin: 0 }}>{booking.cnic}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>AMOUNT PAID</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed', margin: 0 }}>Rs. {(price * (selectedSeats.length || 1) + 50)?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#7c3aed', padding: '10px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: 0 }}>Powered by BusBook Pakistan</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: 0 }}>Please carry this ticket while boarding</p>
      </div>
    </div>
  );
};

const BookingCard = ({ booking }) => {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fromCity = booking.fromCity || booking.bus?.fromCity || "—";
  const toCity = booking.toCity || booking.bus?.toCity || "—";
  const busName = booking.bus?.busName || booking.busName || "Private Trip";
  const busType = booking.bus?.busType || booking.busType || "AC";
  const date = booking.bus?.date || booking.date || "—";
  const departureTime = booking.departureTime || booking.bus?.departureTime || "—";
  const duration = booking.bus?.duration || booking.duration || "2h 30m";
  const price = booking.price || booking.bus?.price || 0;
  const selectedSeats = booking.selectedSeats || [];
  const bookedOn = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString()
    : "—";

  const status = statusConfig[booking.bookingStatus] || statusConfig.pending;
  const isCancelled = booking.bookingStatus === "cancelled";
const canDownload = booking.bookingStatus === "confirmed";


  const downloadTicket = useCallback(async () => {
    if (!canDownload) return;
    setDownloading(true);
    const run = async () => {
      const canvas = await window.html2canvas(ticketRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `ticket-${booking.bookingId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloading(false);
    };
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = run;
      script.onerror = () => setDownloading(false);
      document.head.appendChild(script);
    } else { run(); }
  }, [booking, isCancelled]);

  return (
    <>
      <PrintTicket booking={booking} ticketRef={ticketRef} />

      <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden
        ${isCancelled ? 'border-red-100 opacity-80' : 'border-gray-100 hover:shadow-md'}`}>

        <div className={`h-1 w-full ${
          booking.bookingStatus === 'confirmed' ? 'bg-green-500' :
          booking.bookingStatus === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
        }`} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-extrabold text-gray-800">
                  {fromCity}
                  <span className="text-primary mx-2">→</span>
                  {toCity}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{busType}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{busName}</p>
            </div>

            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Armchair size={16} className="text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Booked Seats</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span key={seat} className="inline-flex items-center justify-center w-10 h-10 bg-primary text-white rounded-xl font-bold shadow-sm">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Calendar size={13} className="text-primary" /> {date !== "—" ? date : "Date not set"}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Clock size={13} className="text-primary" /> {departureTime !== "—" ? departureTime : "Time not set"}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <MapPin size={13} className="text-primary" /> {duration}
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-2xl font-extrabold text-primary">
                Rs. {(price * (selectedSeats.length || 1) + 50).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                ID: <span className="font-mono font-semibold text-gray-600">{booking.bookingId}</span>
              </p>
              {selectedSeats.length > 1 && (
                <p className="text-xs text-gray-400 mt-1">
                  ({selectedSeats.length} seats × Rs. {price.toLocaleString()} + Rs. 50 fee)
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-sm font-medium transition"
              >
                {expanded ? 'Less' : 'Details'}
                <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
              </button>

              <button
                onClick={downloadTicket}
                disabled={downloading || !canDownload}
                title={!canDownload ? 'Cancelled tickets cannot be downloaded' : 'Download Ticket'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                  ${!canDownload
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:scale-105 hover:shadow-md'}`}
              >
                {downloading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Download size={15} />}
                {downloading ? 'Saving...' : 'Ticket'}
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Passenger', value: booking.passengerName },
                { label: 'Phone', value: booking.phone },
                { label: 'CNIC', value: booking.cnic },
                { label: 'Seats', value: selectedSeats.length > 0 ? selectedSeats.join(", ") : "—" },
                { label: 'Payment Method', value: booking.paymentMethod },
                { label: 'Booked On', value: bookedOn },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="font-semibold text-gray-700 text-sm break-words">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { getUserBookings } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const data = await getUserBookings();
      setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const filters = ['All', 'confirmed', 'pending', 'cancelled'];
  const filterLabels = { All: 'All', confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled' };

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'All' || b.bookingStatus === filter;
    const q = search.toLowerCase();
    const fromCity = b.fromCity || b.bus?.fromCity || "";
    const toCity = b.toCity || b.bus?.toCity || "";
    const busName = b.bus?.busName || b.busName || "";
    const matchSearch = !q ||
      busName.toLowerCase().includes(q) ||
      fromCity.toLowerCase().includes(q) ||
      toCity.toLowerCase().includes(q) ||
      b.bookingId?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    All: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
    pending: bookings.filter(b => b.bookingStatus === 'pending').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Ticket size={15} />
            Your Travel History
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            My <span className="text-yellow-300">Bookings</span>
          </h1>
          <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">
            Track, manage and download all your bus tickets in one place.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/30">
              <Search size={20} className="ml-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by bus name, city or booking ID…"
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
              {['confirmed', 'pending', 'cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition capitalize
                    ${filter === s
                      ? 'bg-white text-primary border-white'
                      : 'bg-white/10 text-white border-white/25 hover:bg-white/20'}`}
                >
                  {filterLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {filters.map(f => {
            const colors = {
              All: 'bg-primary text-white',
              confirmed: 'bg-green-500 text-white',
              pending: 'bg-yellow-400 text-white',
              cancelled: 'bg-red-500 text-white',
            };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${filter === f
                    ? colors[f]
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
              >
                {filterLabels[f]}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${filter === f ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-gray-500 text-sm">Loading your bookings...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map(b => <BookingCard key={b._id} booking={b} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <Ticket size={44} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500 max-w-xs mb-6">
              {search ? 'Try a different search term.' : 'You have no bookings in this category.'}
            </p>
            <button onClick={() => navigate('/buses')}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:scale-105 transition flex items-center gap-2">
              <Bus size={18} /> Browse Buses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;