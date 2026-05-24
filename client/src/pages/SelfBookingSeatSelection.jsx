import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Armchair, Clock, AlertCircle, ChevronRight, ChevronLeft, Bus, Calendar, MapPin } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SelfBookingSeatSelection = () => {
  const { tempBusId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  
  const [tempBus, setTempBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchTripDetails();
  }, [tempBusId]);
  
  const fetchTripDetails = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/self-booking/trip/${tempBusId}`,
        { headers: { token } }
      );
      
      if (data.success) {
        setTempBus(data.tempBus);
        
        const seatMap = Array.from({ length: data.totalSeats }, (_, i) => ({
          number: i + 1,
          status: data.bookedSeats.includes(i + 1) ? "booked" : "available"
        }));
        setSeats(seatMap);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSeat = (seatNumber) => {
    const seat = seats.find(s => s.number === seatNumber);
    if (seat.status !== "available") return;
    
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };
  
  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }
    
    setLocking(true);
    
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/self-booking/lock-seats`,
        {
          tempBusId,
          seatNumbers: selectedSeats
        },
        { headers: { token } }
      );
      
      if (data.success) {
        navigate(`/self-booking/payment/${tempBusId}`, {
          state: {
            selectedSeats,
            lockId: data.lockId,
            tempBus,
            totalAmount: tempBus.price * selectedSeats.length + 50
          }
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to lock seats");
    } finally {
      setLocking(false);
    }
  };
  
  const renderSeats = () => {
    const rows = [];
    for (let i = 0; i < seats.length; i += 4) {
      rows.push(seats.slice(i, i + 4));
    }
    
    return rows.map((row, rowIdx) => (
      <div key={rowIdx} className="flex justify-center gap-3 mb-3 flex-wrap">
        {row.map(seat => {
          let bgColor = "bg-white border-gray-300 text-gray-700";
          let cursorClass = "cursor-pointer";
          
          if (seat.status === "booked") {
            bgColor = "bg-red-100 border-red-300 text-red-400";
            cursorClass = "cursor-not-allowed";
          } else if (selectedSeats.includes(seat.number)) {
            bgColor = "bg-primary border-primary text-white";
          }
          
          return (
            <button
              key={seat.number}
              onClick={() => toggleSeat(seat.number)}
              disabled={seat.status !== "available"}
              className={`w-14 h-14 rounded-xl border-2 font-bold transition-all duration-200
                ${bgColor} ${cursorClass}
                ${seat.status === "available" && !selectedSeats.includes(seat.number) 
                  ? "hover:bg-primary/10 hover:border-primary hover:scale-105" : ""}
                disabled:opacity-60`}
            >
              {seat.number}
            </button>
          );
        })}
      </div>
    ));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-gray-600">{error}</p>
        <button onClick={() => navigate("/")} className="bg-primary text-white px-6 py-2 rounded-xl">
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-primary mb-4 hover:underline">
          <ChevronLeft size={18} /> Back to Home
        </button>
        
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Select Your Seats</h2>
            <div className="bg-primary/5 rounded-xl p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Bus size={16} className="text-primary" />
                  <span className="text-sm font-medium">{tempBus?.busName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm">{tempBus?.fromCity} → {tempBus?.toCity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-sm">{tempBus?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm">{tempBus?.departureTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mb-6 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-primary rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 border-2 border-red-300 rounded"></div>
              <span>Booked</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 overflow-x-auto">
            <div className="text-center mb-4 text-xs text-gray-400 flex items-center justify-center gap-2">
              <Bus size={14} /> DRIVER
            </div>
            {renderSeats()}
            <div className="text-center mt-4 text-xs text-gray-400">
              BACK ⬇️
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <p className="text-sm text-gray-500">Selected Seats</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  Rs. {(tempBus?.price * selectedSeats.length + 50).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">(Rs. {tempBus?.price}/seat + Rs. 50 fee)</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0 || locking}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {locking ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Locking Seats...</>
            ) : (
              <>Continue to Payment <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfBookingSeatSelection;