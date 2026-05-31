import React, { useRef, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Bus, Home, Clock } from "lucide-react";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, isSelfBooking } = location.state || {};
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">No booking information found.</p>
        <button onClick={() => navigate("/")} className="bg-primary text-white px-6 py-2 rounded-xl">
          Go Home
        </button>
      </div>
    );
  }

  const selectedSeats = booking.selectedSeats || [];
  const price = booking.price || booking.bus?.price || 0;
  const totalAmount = price * (selectedSeats.length || 1) + 50;
  const isPending = booking.bookingStatus?.toLowerCase() === "pending";

  const downloadTicket = useCallback(async () => {
    if (isPending) return;
    setDownloading(true);
    try {
      const run = async () => {
        const canvas = await window.html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        link.download = `ticket-${booking.bookingId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setDownloading(false);
      };

      if (!window.html2canvas) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = run;
        script.onerror = () => {
          console.error("Failed to load html2canvas");
          setDownloading(false);
        };
        document.head.appendChild(script);
      } else {
        run();
      }
    } catch (err) {
      console.error("Download failed:", err);
      setDownloading(false);
    }
  }, [booking.bookingId, isPending]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-lg mx-auto">

        <div
          ref={ticketRef}
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "500px",
            background: "#fff",
            fontFamily: "sans-serif",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "24px", color: "#fff" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>BUS TICKET</h2>
            <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>Booking ID: {booking.bookingId}</p>
          </div>
          <div style={{ padding: "20px", background: "#f8f7ff" }}>
            {[
              { label: "PASSENGER", value: booking.passengerName },
              { label: "SEATS", value: selectedSeats.join(", ") || "—" },
              { label: "FROM", value: booking.fromCity || booking.bus?.fromCity },
              { label: "TO", value: booking.toCity || booking.bus?.toCity },
              { label: "DATE", value: booking.date || booking.bus?.date },
              { label: "AMOUNT PAID", value: `Rs. ${totalAmount.toLocaleString()}` },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #e9d5ff" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: "bold" }}>{item.label}</span>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#7c3aed", padding: "10px", textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>
            Powered by BusGo Pakistan | Please carry this ticket while boarding
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

        
          {isPending ? (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={44} className="text-yellow-500" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={44} className="text-green-500" />
            </div>
          )}

        
          {isPending ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted! ⏳</h2>
              <p className="text-gray-500 mb-6">
                Your booking is pending admin confirmation. Download ticket from My Bookings after approval.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed! 🎉</h2>
              <p className="text-gray-500 mb-6">
                Your {isSelfBooking ? "self-created trip" : "bus"} has been booked successfully.
              </p>
            </>
          )}

       
          <div className={`rounded-xl p-4 mb-6 text-left border-2 border-dashed ${isPending ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-transparent"}`}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-bold">{booking.bookingId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Status</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPending ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}>
                {isPending ? "⏳ Pending" : "✅ Confirmed"}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Passenger</span>
              <span className="font-semibold">{booking.passengerName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Seats</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {selectedSeats.length > 0 ? selectedSeats.map(seat => (
                  <span key={seat} className="bg-primary text-white text-xs px-2 py-1 rounded-md">{seat}</span>
                )) : <span>—</span>}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Route</span>
              <span>{booking.fromCity || booking.bus?.fromCity} → {booking.toCity || booking.bus?.toCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-primary">Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>

       
       
          <div className="flex gap-3">
            {isPending ? (
              <button
                disabled
                className="flex-1 border-2 border-yellow-300 text-yellow-500 bg-yellow-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-70"
              >
                <Download size={18} />
                Ticket available after confirmation
              </button>
            ) : (
              <button
                onClick={downloadTicket}
                disabled={downloading}
                className="flex-1 border-2 border-primary text-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition disabled:opacity-50"
              >
                <Download size={18} />
                {downloading ? "Generating..." : "Download Ticket"}
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Home size={18} /> Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;