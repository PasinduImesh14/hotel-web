import emailjs from '@emailjs/nodejs';

const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY!;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY!;
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID!;

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

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      process.env.EMAILJS_ADMIN_TEMPLATE_ID!, 
      {
        customer_name: customerName,
        customer_phone: customerPhone,
        room_name: roomName,
        check_in_date: checkInDate,
        check_in_time: checkInTime,
        check_out_date: checkOutDate,
        check_out_time: checkOutTime,
        to_email: process.env.ADMIN_EMAIL, 
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );
    
    return result;
  } catch (error) {
    console.error(' Admin email failed:', error);
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

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      process.env.EMAILJS_CUSTOMER_TEMPLATE_ID!, 
      {
        customer_name: customerName,
        room_name: roomName,
        check_in_date: checkInDate,
        check_in_time: checkInTime,
        check_out_date: checkOutDate,
        check_out_time: checkOutTime,
        to_email: customerEmail, 
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );
    
    return result;
  } catch (error) {
    console.error(' Customer email failed:', error);
    throw error;
  }
}