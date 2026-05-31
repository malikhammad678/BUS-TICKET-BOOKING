import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendBookingSMS = async (phone, bookingData) => {
  try {
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+92" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+92" + formattedPhone;
    }

    await client.messages.create({
      body: `BusGo Pakistan
Booking Submitted!

Booking ID: ${bookingData.bookingId}
Passenger: ${bookingData.passengerName}
Seats: ${bookingData.selectedSeats.join(", ")}
Route: ${bookingData.fromCity} -> ${bookingData.toCity}
Date: ${bookingData.date}
Departure: ${bookingData.departureTime}
Amount: Rs. ${bookingData.totalAmount}

Status: Pending Admin Confirmation`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`SMS sent to ${formattedPhone}`);
  } catch (error) {
    console.error("SMS failed:", error.message);
  }
};

export const sendStatusSMS = async (phone, bookingData) => {
  try {
    if (!phone) {
      console.warn("sendStatusSMS: No phone provided");
      return;
    }
    
    let formattedPhone = phone.toString().trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+92" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+92" + formattedPhone;
    }

    const seatsText = Array.isArray(bookingData.selectedSeats) 
      ? bookingData.selectedSeats.join(", ") 
      : "N/A";

    const isConfirmed = bookingData.status === "confirmed";

    await client.messages.create({
      body: `BusGo Pakistan
Booking ${isConfirmed ? "Confirmed" : "Cancelled"}

Booking ID: ${bookingData.bookingId}
Passenger: ${bookingData.passengerName}
Seats: ${seatsText}
Route: ${bookingData.fromCity} -> ${bookingData.toCity}
Date: ${bookingData.date}
Departure: ${bookingData.departureTime}
Amount: Rs. ${bookingData.totalAmount}

${isConfirmed
  ? "Confirmed by admin! Download ticket from app."
  : "Cancelled. Contact support for refund."}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`Status SMS sent to ${formattedPhone}`);
  } catch (error) {
    console.error("SMS failed:", error.message);
  }
};