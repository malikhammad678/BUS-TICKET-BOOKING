import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ChevronLeft, Lock, User, Phone, CreditCard, Bus, Calendar, Clock, MapPin } from "lucide-react";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

const PaymentForm = ({ tempBus, selectedSeats, lockId, totalAmount, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passenger, setPassenger] = useState({
    name: "",
    phone: "",
    cnic: "",
    gender: "Male"
  });
  const token = localStorage.getItem("userToken");
  
  const handleChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };
  
  const handlePayment = async () => {
    if (!passenger.name || !passenger.phone || !passenger.cnic) {
      setError("Please fill all passenger details");
      return;
    }
    
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
        const { data: bookingData } = await axios.post(
          `${BACKEND_URL}/self-booking/confirm-booking`,
          {
            tempBusId: tempBus._id,
            lockId: lockId,
            paymentIntentId: result.paymentIntent.id,
            passengerName: passenger.name,
            gender: passenger.gender,
            phone: passenger.phone,
            cnic: passenger.cnic,
          },
          { headers: { token } }
        );
        
        if (bookingData.success) {
          onSuccess(bookingData.booking);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Passenger Details</h3>
        <div className="space-y-3">
          <div className="relative">
            <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={passenger.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div className="relative">
            <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={passenger.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div className="relative">
            <CreditCard size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="cnic"
              placeholder="CNIC *"
              value={passenger.cnic}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div className="flex gap-3">
            {["Male", "Female", "Other"].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setPassenger(prev => ({ ...prev, gender: g }))}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition
                  ${passenger.gender === g ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Card Details</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Card Number</label>
            <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/30">
              <CardNumberElement options={cardStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
              <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/30">
                <CardExpiryElement options={cardStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">CVC</label>
              <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/30">
                <CardCvcElement options={cardStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          ❌ {error}
        </div>
      )}
      
      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={!stripe || loading}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
          ) : (
            <><Lock size={15} /> Pay Rs. {totalAmount.toLocaleString()}</>
          )}
        </button>
      </div>
    </div>
  );
};

const SelfBookingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tempBusId } = useParams();
  const { selectedSeats, lockId, tempBus, totalAmount } = location.state || {};
  
  if (!tempBus || !selectedSeats || !lockId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Invalid payment session. Please start over.</p>
        <button onClick={() => navigate("/")} className="bg-primary text-white px-6 py-2 rounded-xl">
          Go Home
        </button>
      </div>
    );
  }
  
  const handleSuccess = (booking) => {
    navigate("/booking-success", { state: { booking, isSelfBooking: true } });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary mb-4">
          <ChevronLeft size={18} /> Back
        </button>
        
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Complete Payment</h2>
          
          <div className="bg-primary/5 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Bus size={18} className="text-primary" />
              <span className="font-semibold">{tempBus.busName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin size={14} /> {tempBus.fromCity} → {tempBus.toCity}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar size={14} /> {tempBus.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} /> {tempBus.departureTime}
            </div>
            <div className="mt-3 pt-3 border-t border-primary/20">
              <div className="flex justify-between text-sm">
                <span>Seats: {selectedSeats.join(", ")}</span>
                <span className="font-bold text-primary">Rs. {(tempBus.price * selectedSeats.length).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Service Fee</span>
                <span>Rs. 50</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-primary/20">
                <span>Total</span>
                <span className="text-primary text-lg">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <Elements stripe={stripePromise}>
            <PaymentForm
              tempBus={tempBus}
              selectedSeats={selectedSeats}
              lockId={lockId}
              totalAmount={totalAmount}
              onSuccess={handleSuccess}
              onBack={() => navigate(-1)}
            />
          </Elements>
          
          <div className="mt-4 text-center text-xs text-gray-400">
            <Lock size={12} className="inline mr-1" /> Secure payment powered by Stripe
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfBookingPayment;