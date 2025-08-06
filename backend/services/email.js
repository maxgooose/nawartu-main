const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send booking confirmation to guest
const sendBookingConfirmationToGuest = async (booking, guest, property) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: guest.email,
    subject: `Booking Confirmed - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #012F01;">Booking Confirmed! 🎉</h2>
        <p>Dear ${guest.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #012F01; margin-top: 0;">${property.title}</h3>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
          <p><strong>Address:</strong> ${property.location.address}</p>
        </div>
        
        <p>Your host will contact you with check-in instructions closer to your arrival date.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>The Nawartu Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to guest');
  } catch (error) {
    console.error('Error sending booking confirmation email to guest:', error);
  }
};

// Send booking notification to host
const sendBookingNotificationToHost = async (booking, host, property, guest) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: host.email,
    subject: `New Booking Request - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #012F01;">New Booking Request 📧</h2>
        <p>Dear ${host.name},</p>
        <p>You have received a new booking request for your property. Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #012F01; margin-top: 0;">${property.title}</h3>
          <p><strong>Guest:</strong> ${guest.name}</p>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
          ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
        </div>
        
        <p>Please log in to your dashboard to confirm or decline this booking.</p>
        <p>Best regards,<br>The Nawartu Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking notification email sent to host');
  } catch (error) {
    console.error('Error sending booking notification email to host:', error);
  }
};

// Send booking status update
const sendBookingStatusUpdate = async (booking, user, property, status) => {
  const transporter = createTransporter();
  
  const statusMessages = {
    confirmed: 'Your booking has been confirmed by the host!',
    cancelled: 'Your booking has been cancelled.',
    completed: 'Your stay has been completed. We hope you enjoyed it!'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #012F01;">Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
        <p>Dear ${user.name},</p>
        <p>${statusMessages[status]}</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #012F01; margin-top: 0;">${property.title}</h3>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        </div>
        
        <p>Best regards,<br>The Nawartu Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending booking status update email:', error);
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Welcome to Nawartu! 🏠',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #012F01;">Welcome to Nawartu!</h2>
        <p>Dear ${user.name},</p>
        <p>Welcome to Nawartu, your premier destination for discovering unique homes in Damascus!</p>
        
        <p>We're excited to have you join our community. Here's what you can do:</p>
        <ul>
          <li>Browse and book amazing properties</li>
          <li>List your own property to host guests</li>
          <li>Connect with local hosts</li>
          <li>Experience authentic Syrian hospitality</li>
        </ul>
        
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        
        <p>Happy exploring!<br>The Nawartu Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to new user');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = {
  sendBookingConfirmationToGuest,
  sendBookingNotificationToHost,
  sendBookingStatusUpdate,
  sendWelcomeEmail
}; 