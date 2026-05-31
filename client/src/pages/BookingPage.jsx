import { useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User, Phone, CreditCard, ChevronRight, ChevronLeft,
  CheckCircle, Bus, Calendar, Clock, MapPin, Download, Lock
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import SeatSelector from "../components/SeatSelector";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const steps = ["Select Seats", "Passenger Info", "Payment", "Confirmation"];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-10 w-full overflow-hidden">
    {steps.map((label, i) => (
      <div key={i} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
            ${i < current ? "bg-green-500 text-white" : i === current ? "bg-primary text-white scale-110 shadow-lg" : "bg-gray-200 text-gray-400"}`}>
            {i < current ? <CheckCircle size={16} /> : i + 1}
          </div>
          <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${i === current ? "text-primary" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-8 sm:w-14 h-0.5 mb-4 mx-0.5 transition-all duration-500 ${i < current ? "bg-green-500" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
  </div>
);

const BusSummary = ({ bus }) => (
  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
    <img src={bus.image} alt={bus.busName} className="w-full sm:w-28 h-20 object-cover rounded-xl" />
    <div className="flex-1 space-y-1">
      <h3 className="font-bold text-gray-800 text-lg">
        {bus.fromCity} <span className="text-primary">→</span> {bus.toCity}
      </h3>
      <p className="text-gray-500 text-sm">{bus.busName} · {bus.busType}</p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
        <span className="flex items-center gap-1"><Calendar size={13} />{bus.date}</span>
        <span className="flex items-center gap-1"><Clock size={13} />{bus.departureTime}</span>
        <span className="flex items-center gap-1"><MapPin size={13} />Duration: {bus.duration}</span>
      </div>
    </div>
    <div className="text-right">
      <p className="text-2xl font-extrabold text-primary">Rs. {bus.price?.toLocaleString()}</p>
      <p className="text-xs text-gray-400">per seat</p>
    </div>
  </div>
);

const PassengerForm = ({ data, setData, onNext }) => {
  const handle = (field) => (e) => setData(prev => ({ ...prev, [field]: e.target.value }));
  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white";

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Passenger Details</h2>
      <p className="text-gray-500 text-sm mb-6">Fill in the details as per your CNIC</p>
      <div className="space-y-4">
        <div className="relative">
          <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Full Name" value={data.name} onChange={handle("name")} required className={inputClass} />
        </div>
        <div className="relative">
          <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="tel" placeholder="Phone Number (03XXXXXXXXX)" value={data.phone} onChange={handle("phone")} required className={inputClass} />
        </div>
        <div className="relative">
          <CreditCard size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="CNIC (XXXXX-XXXXXXX-X)" value={data.cnic} onChange={handle("cnic")} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Gender</label>
          <div className="flex gap-3">
            {["Male", "Female", "Other"].map(g => (
              <button key={g} type="button" onClick={() => setData(prev => ({ ...prev, gender: g }))}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                  ${data.gender === g ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => { if (data.name && data.phone && data.cnic && data.gender) onNext(); }}
        className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg transition-all">
        Continue to Payment <ChevronRight size={18} />
      </button>
    </div>
  );
};

const cardStyle = {
  style: {
    base: {
      fontSize: "14px",
      color: "#374151",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const PaymentForm = ({ bus, passenger, selectedSeats, lockId, onBack, onPay }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");

  const totalAmount = bus.price * selectedSeats.length + 50;

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/payment/create-intent`,
        { amount: totalAmount },
        { headers: { token } }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: passenger.name,
            phone: passenger.phone,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await axios.post(
          `${BACKEND_URL}/booking/confirm-booking`,
          {
            lockId: lockId,
            paymentIntentId: result.paymentIntent.id,
            passengerName: passenger.name,
            gender: passenger.gender,
            phone: passenger.phone,
            cnic: passenger.cnic,
          },
          { headers: { token } }
        );

        onPay(result.paymentIntent.id);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Payment</h2>
      <p className="text-gray-500 text-sm mb-6">Enter your card details to complete booking</p>

      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs font-semibold tracking-widest opacity-80">SECURE PAYMENT</p>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <Lock size={11} />
            <span className="text-xs font-bold">SSL Encrypted</span>
          </div>
        </div>
        <p className="text-2xl font-extrabold tracking-widest mb-1">•••• •••• •••• ••••</p>
        <p className="text-xs opacity-70 mt-4">{passenger.name?.toUpperCase() || "CARD HOLDER"}</p>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Card Number</label>
          <div className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Expiry Date</label>
            <div className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition">
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">CVC</label>
            <div className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition">
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600 font-medium">
          🧪 Test card: <span className="font-bold">4242 4242 4242 4242</span> · Any future date · Any CVC
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 font-medium">
            ❌ {error}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Ticket Price ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})</span>
          <span>Rs. {(bus.price * selectedSeats.length).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Selected Seats</span>
          <span className="font-medium">{selectedSeats.join(", ")}</span>
        </div>
        <div className="flex justify-between text-gray-600"><span>Service Fee</span><span>Rs. 50</span></div>
        <div className="h-px bg-gray-200 my-1" />
        <div className="flex justify-between font-bold text-gray-800 text-base">
          <span>Total</span>
          <span className="text-primary">Rs. {totalAmount?.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1 transition text-sm font-medium">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={handlePay} disabled={!stripe || loading}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
            : <><Lock size={15} /> Pay Rs. {totalAmount?.toLocaleString()} <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

const PrintTicket = ({ bus, passenger, selectedSeats, bookingId, ticketRef }) => (
  <div ref={ticketRef} style={{
    position: "fixed", left: "-9999px", top: 0,
    width: "600px", background: "#fff", fontFamily: "sans-serif",
    borderRadius: "16px", overflow: "hidden"
  }}>
    <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "28px 32px", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, letterSpacing: 2 }}>BUS TICKET</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{bus.fromCity} → {bus.toCity}</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.85, fontSize: 14 }}>{bus.busName} · {bus.busType}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>BOOKING ID</p>
          <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>{bookingId}</p>
          <div style={{ background: "#eab308", borderRadius: 8, padding: "6px 14px", marginTop: 8, fontSize: 12, fontWeight: 800, color: "#fff", display: "inline-block" }}>
            ⏳ PENDING
          </div>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", background: "#f8f7ff" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", marginLeft: -10 }} />
      <div style={{ flex: 1, borderTop: "2px dashed #d8b4fe", margin: "0 8px" }} />
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", marginRight: -10 }} />
    </div>
    <div style={{ padding: "24px 32px", background: "#f8f7ff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: 20 }}>
        {[
          { label: "PASSENGER", value: passenger.name },
          { label: "GENDER", value: passenger.gender },
          { label: "PHONE", value: passenger.phone },
          { label: "SEATS", value: selectedSeats.join(", ") },
          { label: "DEPARTURE DATE", value: bus.date },
          { label: "DEPARTURE TIME", value: bus.departureTime },
          { label: "DURATION", value: bus.duration },
        ].map((item, i) => (
          <div key={i}>
            <p style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #e9d5ff", margin: "16px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>CNIC</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", margin: 0 }}>{passenger.cnic}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>AMOUNT PAID</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed", margin: 0 }}>Rs. {(bus.price * selectedSeats.length + 50)?.toLocaleString()}</p>
        </div>
      </div>
    </div>
    <div style={{ background: "#7c3aed", padding: "10px 32px", display: "flex", justifyContent: "space-between" }}>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>Powered by BusGo Pakistan</p>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>Please carry this ticket while boarding</p>
    </div>
  </div>
);

const Confirmation = ({ bus, passenger, selectedSeats, paymentId }) => {
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  const [bookingId] = useState(() => "BK" + Math.random().toString(36).substring(2, 8).toUpperCase());

  return (
    <div className="text-center">
      <PrintTicket bus={bus} passenger={passenger} selectedSeats={selectedSeats} bookingId={bookingId} ticketRef={ticketRef} />

      {/* ⏳ Pending icon */}
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock size={44} className="text-yellow-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Booking Submitted! ⏳</h2>
      <p className="text-gray-500 text-sm mb-6">Your booking is pending admin confirmation. You can download your ticket from My Bookings after approval.</p>

      <div className="bg-white border-2 border-dashed border-yellow-300 rounded-2xl p-5 mb-4 text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-300" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Booking ID</p>
            <p className="font-bold text-primary text-lg">{bookingId}</p>
          </div>
          <div className="bg-yellow-100 px-3 py-1 rounded-full">
            <span className="text-yellow-600 text-xs font-bold">⏳ PENDING</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-400 text-xs">Passenger</p><p className="font-semibold">{passenger.name}</p></div>
          <div><p className="text-gray-400 text-xs">Gender</p><p className="font-semibold">{passenger.gender}</p></div>
          <div><p className="text-gray-400 text-xs">Seats</p><p className="font-semibold">{selectedSeats.join(", ")}</p></div>
          <div><p className="text-gray-400 text-xs">From</p><p className="font-semibold">{bus.fromCity}</p></div>
          <div><p className="text-gray-400 text-xs">To</p><p className="font-semibold">{bus.toCity}</p></div>
          <div><p className="text-gray-400 text-xs">Date</p><p className="font-semibold">{bus.date}</p></div>
          <div><p className="text-gray-400 text-xs">Departure</p><p className="font-semibold">{bus.departureTime}</p></div>
          <div><p className="text-gray-400 text-xs">Bus</p><p className="font-semibold">{bus.busName}</p></div>
          <div><p className="text-gray-400 text-xs">Amount Paid</p><p className="font-semibold text-primary">Rs. {(bus.price * selectedSeats.length + 50)?.toLocaleString()}</p></div>
        </div>
      </div>

      <button
        disabled
        title="Ticket download available after admin confirmation"
        className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-yellow-300 text-yellow-500 bg-yellow-50 font-semibold cursor-not-allowed opacity-70">
        <Download size={18} /> Ticket available after admin confirmation
      </button>

      <div className="flex gap-3">
        <button onClick={() => navigate("/buses")} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
          Book Another
        </button>
        <button onClick={() => navigate("/")} className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition">
          Go Home
        </button>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus;

  const [step, setStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockId, setLockId] = useState(null);
  const [passenger, setPassenger] = useState({ name: "", phone: "", cnic: "", gender: "" });
  const [paymentId, setPaymentId] = useState("");

  if (!bus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Bus size={48} className="text-primary" />
        <p className="text-gray-600 font-medium">No bus selected.</p>
        <button onClick={() => navigate("/buses")} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:scale-105 transition">
          Browse Buses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Bus size={15} /> Complete Your Booking
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Book Your Seat</h1>
        </div>
        <StepBar current={step} />
        <BusSummary bus={bus} />
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
          {step === 0 && (
            <SeatSelector
              bus={bus}
              date={bus.date}
              onSeatsSelected={(seats, lock) => {
                setSelectedSeats(seats);
                setLockId(lock);
                setStep(1);
              }}
              onBack={() => navigate("/buses")}
            />
          )}
          {step === 1 && (
            <PassengerForm
              data={passenger}
              setData={setPassenger}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                bus={bus}
                passenger={passenger}
                selectedSeats={selectedSeats}
                lockId={lockId}
                onBack={() => setStep(1)}
                onPay={(pid) => { setPaymentId(pid); setStep(3); }}
              />
            </Elements>
          )}
          {step === 3 && (
            <Confirmation
              bus={bus}
              passenger={passenger}
              selectedSeats={selectedSeats}
              paymentId={paymentId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;