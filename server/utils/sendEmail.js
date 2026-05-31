import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendBookingEmail = async (toEmail, bookingData) => {
  try {
    await transporter.sendMail({
      from: `"BusGo Pakistan" <${process.env.BREVO_SENDER}>`,
      to: toEmail,
      subject: `Booking Submitted ⏳ - ${bookingData.bookingId}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #e9d5ff;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:24px 32px;color:#fff">
            <h2 style="margin:0">BusGo Pakistan 🚌</h2>
            <p style="margin:6px 0 0;opacity:0.85">Booking Submitted Successfully</p>
          </div>
          <div style="padding:24px 32px">
            <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:12px 16px;margin-bottom:20px">
              <b>⏳ Status: Pending Admin Confirmation</b>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280">Booking ID</td>
                  <td style="padding:8px 0;font-weight:700;color:#7c3aed">${bookingData.bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Passenger</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.passengerName}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Seats</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.selectedSeats.join(", ")}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Route</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.fromCity} → ${bookingData.toCity}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Date</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.date}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Departure</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.departureTime}</td></tr>
              <tr style="border-top:2px solid #e9d5ff">
                <td style="padding:12px 0;color:#6b7280;font-weight:700">Amount Paid</td>
                <td style="padding:12px 0;font-weight:800;color:#7c3aed;font-size:18px">Rs. ${bookingData.totalAmount}</td>
              </tr>
            </table>
          </div>
          <div style="background:#f5f3ff;padding:14px 32px;font-size:12px;color:#7c3aed;text-align:center">
            Please keep this Booking ID for reference while boarding.
          </div>
        </div>
      `,
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error("Email failed:", error.message);
  }
};

export const sendStatusEmail = async (toEmail, bookingData) => {
  try {
    const isConfirmed = bookingData.status === "confirmed";

    await transporter.sendMail({
      from: `"BusGo Pakistan" <${process.env.BREVO_SENDER}>`,
      to: toEmail,
      subject: `Booking ${isConfirmed ? "Confirmed ✅" : "Cancelled ❌"} - ${bookingData.bookingId}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #e9d5ff;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,${isConfirmed ? "#16a34a,#15803d" : "#dc2626,#b91c1c"});padding:24px 32px;color:#fff">
            <h2 style="margin:0">BusGo Pakistan 🚌</h2>
            <p style="margin:6px 0 0;opacity:0.85">Booking ${isConfirmed ? "Confirmed!" : "Cancelled"}</p>
          </div>
          <div style="padding:24px 32px">
            <div style="background:${isConfirmed ? "#dcfce7" : "#fee2e2"};border:1px solid ${isConfirmed ? "#86efac" : "#fca5a5"};border-radius:8px;padding:12px 16px;margin-bottom:20px">
              <b>${isConfirmed
                ? "Your booking has been confirmed by admin! You can Download Your Ticket From Your Bookings. Thanks For Your Patience 🎉"
                : "Your booking has been cancelled. Contact support for refund queries."}</b>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280">Booking ID</td>
                  <td style="padding:8px 0;font-weight:700;color:#7c3aed">${bookingData.bookingId}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Passenger</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.passengerName}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Seats</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.selectedSeats.join(", ")}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Route</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.fromCity} → ${bookingData.toCity}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Date</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.date}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Departure</td>
                  <td style="padding:8px 0;font-weight:600">${bookingData.departureTime}</td></tr>
              <tr style="border-top:2px solid #e9d5ff">
                <td style="padding:12px 0;color:#6b7280;font-weight:700">Amount</td>
                <td style="padding:12px 0;font-weight:800;color:#7c3aed;font-size:18px">Rs. ${bookingData.totalAmount}</td>
              </tr>
            </table>
          </div>
          <div style="background:#f5f3ff;padding:14px 32px;font-size:12px;color:#7c3aed;text-align:center">
            ${isConfirmed ? "Please carry your Booking ID while boarding." : "Contact support for any queries."}
          </div>
        </div>
      `,
    });
    console.log(`Status email sent to ${toEmail}`);
  } catch (error) {
    console.error("Status email failed:", error.message);
  }
};