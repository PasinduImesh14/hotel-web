import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendBookingNotification(
  customerName: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
   customerPhone: string
) {
  // Extract date and time
  const checkInDate = checkIn.split("T")[0];
  const checkInTime = checkIn.split("T")[1]?.substring(0, 5);

  const checkOutDate = checkOut.split("T")[0];
  const checkOutTime = checkOut.split("T")[1]?.substring(0, 5);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking - ${customerName}`,
    text: `
New Booking Received

Customer: ${customerName}
Phone: ${customerPhone}
Room: ${roomName}
Check-In: ${checkInDate} at ${checkInTime}
Check-Out: ${checkOutDate} at ${checkOutTime}
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function sendBookingConfirmationToCustomer(
  customerName: string,
  customerEmail: string,
  roomName: string,
  checkIn: string,
  checkOut: string
) {
  const checkInDate = checkIn.split("T")[0];
  const checkInTime = checkIn.split("T")[1]?.substring(0, 5);

  const checkOutDate = checkOut.split("T")[0];
  const checkOutTime = checkOut.split("T")[1]?.substring(0, 5);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Booking Confirmation - Scenic Cottage`,
    text: `
Dear ${customerName},

Your booking has been confirmed!

Room: ${roomName}
Check-In: ${checkInDate} at ${checkInTime}
Check-Out: ${checkOutDate} at ${checkOutTime}

Payment will be collected at the property.

Contact us: +94 74 055 8858

Thank you,
Scenic Cottage
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Customer email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Customer email failed:", error);
  }
}
