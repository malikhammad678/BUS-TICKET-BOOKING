import React, { useState, useEffect } from "react";
import { Bus, Clock, AlertCircle, ChevronRight } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SeatSelector = ({ bus, date, onSeatsSelected, onBack }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/booking/available-seats/${bus._id}?date=${date}`,
          { headers: { token } }
        );
        
        if (data.success) {
          const seatMap = Array.from({ length: data.totalSeats }, (_, i) => ({
            number: i + 1,
            status: data.bookedSeats.includes(i + 1) ? "booked" :
                    data.lockedSeats.includes(i + 1) ? "locked" : "available"
          }));
          setSeats(seatMap);
        }
      } catch (err) {
        setError("Failed to load seats");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeats();
    const interval = setInterval(fetchSeats, 10000);
    return () => clearInterval(interval);
  }, [bus._id, date, token]);

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
    setError("");
    
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/booking/lock-seats`,
        {
          busId: bus._id,
          date: date,
          seatNumbers: selectedSeats
        },
        { headers: { token } }
      );

      if (data.success) {
        onSeatsSelected(selectedSeats, data.lockId);
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
        {row.map((seat, idx) => {
          let bgColor = "bg-white border-gray-300 text-gray-700";
          let cursorClass = "cursor-pointer";
          
          if (seat.status === "booked") {
            bgColor = "bg-red-100 border-red-300 text-red-400";
            cursorClass = "cursor-not-allowed";
          } else if (seat.status === "locked") {
            bgColor = "bg-yellow-100 border-yellow-300 text-yellow-600";
            cursorClass = "cursor-not-allowed";
          } else if (selectedSeats.includes(seat.number)) {
            bgColor = "bg-primary border-primary text-white";
            cursorClass = "cursor-pointer";
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
        {row.length === 4 && rowIdx % 2 === 1 && (
          <div className="w-full h-2" />
        )}
      </div>
    ));
  };

  if (loading && seats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-gray-500 mt-4">Loading seat layout...</p>
      </div>
    );
  }

  const totalAmount = bus.price * selectedSeats.length + 50;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Select Your Seats</h2>
      <p className="text-gray-500 text-sm mb-6">
        {bus.busName} · {bus.busType} · {date}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

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
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span>Locked</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-6 overflow-x-auto">
        <div className="text-center mb-4 text-xs text-gray-400 flex items-center justify-center gap-2">
          <Bus size={16} /> DRIVER
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
              Rs. {totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">(Rs. {bus.price}/seat + Rs. 50 fee)</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium"
        >
          Back to Buses
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedSeats.length === 0 || locking}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {locking ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Locking Seats...</>
          ) : (
            <>Continue to Passenger Info <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;