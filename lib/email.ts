import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");

let transporter: any;
if (!EMAIL_USER || !EMAIL_PASSWORD) {
  console.warn('⚠️ Email credentials missing; email sending is disabled. Set EMAIL_USER and EMAIL_PASSWORD to enable.');
  transporter = {
    sendMail: async (opts: any) => {
      console.warn('Email send attempted but credentials missing. to=', opts && opts.to);
      return { messageId: 'disabled' };
    },
  } as any;
} else {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
}

async function sendMailWithRetry(mailOptions: any) {
  const maxAttempts = 3;
  let lastError: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (err: any) {
      lastError = err;
      console.error(`Email send attempt ${attempt} failed: ${err && err.message}`, {
        attempt,
        to: mailOptions.to,
        stack: err && err.stack,
      });
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

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
    const result = await sendMailWithRetry(mailOptions);
    return result;
  } catch (error) {
    console.error('❌ Admin email failed after retries:', error && error.stack ? error.stack : error);
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
    const result = await sendMailWithRetry(mailOptions);
    console.log("✅ Customer email sent:", result.messageId);
    return result;
  } catch (error: any) {
    console.error("❌ Customer email failed after retries:", error && error.stack ? error.stack : error);
    // Do not throw to avoid failing the main booking flow; caller already logs
  }
}
