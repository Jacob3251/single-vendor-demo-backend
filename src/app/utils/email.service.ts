import nodemailer from 'nodemailer';
import Order from '../modules/orders/order.model';
import Profile from '../modules/profile/profile.model';
import Shipping from '../modules/shipping/shipping.model'; // Add this import, adjust path as needed

// Create a transporter object using the SMTP transport configuration from your .env file
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  // 'secure' is true if you're using port 465, false for other ports like 587
  secure: process.env.EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.EMAIL_USER, // Your cPanel email address
    pass: process.env.EMAIL_PASS, // The password for that email account
  },
});

/**
 * Sends a dispatch notification email to a customer.
 */
const sendDispatchNotification = async (order: Order, profile: Profile) => {
  const mailOptions = {
    from: `"AfroWhite Cosmetics" <${process.env.EMAIL_USER}>`,
    to: profile.get('email') as string,
    subject: `Your AfroWhite Order #${order.get('order_no')} has been dispatched!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your Order is on its way!</h2>
        <p>Hello ${profile.get('firstName')},</p>
        <p>This is a confirmation that your order #${order.get('order_no')} has been dispatched and will be with you shortly.</p>
        <p>We will send another email with tracking information as soon as it's available.</p>
        <p>Thank you for your purchase!</p>
        <p><strong>- The AfroWhite Team</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Dispatch email sent for order #${order.get('order_no')}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send dispatch email for order #${order.get('order_no')}:`, error);
  }
};

/**
 * Sends an email with shipping and tracking details to a customer.
 */
const sendDeliveryNotification = async (order: Order, profile: Profile, shipping: Shipping) => {
  const trackingId = order.get('trackingId') as string;
  // ✅ Get the shipping medium from the shipping record
  const shippingMedium = shipping.get('shippingMedium') as string;
  
  if (!trackingId) {
    // ... (error handling)
  }

  const mailOptions = {
    from: `"AfroWhite Cosmetics" <${process.env.EMAIL_USER}>`,
    to: profile.get('email') as string,
    subject: `Shipping Update for AfroWhite Order #${order.get('order_no')}`,
    html: `
      <h1>Your Order has Shipped!</h1>
      <p>Hello ${profile.get('firstName')},</p>
      <p>Great news! Your order #${order.get('order_no')} has been shipped.</p>
      
      <!-- ✅ NEW: Add the shipping medium to the email template -->
      <p><strong>Courier:</strong> ${shippingMedium}</p>
      
      <p>You can track your parcel using the following tracking ID:</p>
      <h2>${trackingId}</h2>
      <p>Please note it may take a few hours for the tracking information to become active.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Delivery email sent for order #${order.get('order_no')}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send delivery email for order #${order.get('order_no')}:`, error);
  }
};


export const EmailServices = {
  sendDispatchNotification,
  sendDeliveryNotification,
};

