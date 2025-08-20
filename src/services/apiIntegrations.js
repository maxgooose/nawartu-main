// API Integration Service for Google Maps, EmailJS, and SMS.to
import emailjs from '@emailjs/browser';

// Environment variables
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.REACT_APP_EMAILJS_PRIVATE_KEY;
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

// Google Maps Integration
export const googleMapsService = {
  // Load Google Maps script
  loadScript: () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = () => resolve(window.google);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Get nearby places
  getNearbyPlaces: async (lat, lng, radius = 1000, type = 'lodging') => {
    try {
      await googleMapsService.loadScript();
      
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);
      
      return new Promise((resolve, reject) => {
        service.nearbySearch({
          location: { lat, lng },
          radius,
          type
        }, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Google Maps error: ${error.message}`);
    }
  },

  // Get place details
  getPlaceDetails: async (placeId) => {
    try {
      await googleMapsService.loadScript();
      
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);
      
      return new Promise((resolve, reject) => {
        service.getDetails({
          placeId,
          fields: ['name', 'formatted_address', 'geometry', 'rating', 'reviews']
        }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(new Error(`Place details failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Google Maps error: ${error.message}`);
    }
  },

  // Geocode address
  geocodeAddress: async (address) => {
    try {
      await googleMapsService.loadScript();
      
      const geocoder = new window.google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Google Maps error: ${error.message}`);
    }
  },

  // Reverse geocode coordinates
  reverseGeocode: async (lat, lng) => {
    try {
      await googleMapsService.loadScript();
      
      const geocoder = new window.google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(new Error(`Reverse geocoding failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Google Maps error: ${error.message}`);
    }
  }
};

// EmailJS Integration
export const emailJSService = {
  // Initialize EmailJS
  init: () => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      return true;
    }
    return false;
  },

  // Send email
  sendEmail: async (templateParams) => {
    try {
      if (!emailJSService.init()) {
        throw new Error('EmailJS not configured properly');
      }

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      return {
        success: true,
        messageId: response.text,
        status: response.status
      };
    } catch (error) {
      throw new Error(`EmailJS error: ${error.message}`);
    }
  },

  // Send booking confirmation email
  sendBookingConfirmation: async (bookingData) => {
    const templateParams = {
      to_email: bookingData.guestEmail,
      guest_name: bookingData.guestName,
      property_name: bookingData.propertyName,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      total_amount: bookingData.totalAmount,
      booking_id: bookingData.bookingId
    };

    return emailJSService.sendEmail(templateParams);
  },

  // Send property inquiry email
  sendPropertyInquiry: async (inquiryData) => {
    const templateParams = {
      to_email: inquiryData.hostEmail,
      guest_name: inquiryData.guestName,
      guest_email: inquiryData.guestEmail,
      property_name: inquiryData.propertyName,
      message: inquiryData.message,
      inquiry_date: new Date().toLocaleDateString()
    };

    return emailJSService.sendEmail(templateParams);
  },

  // Send welcome email
  sendWelcomeEmail: async (userData) => {
    const templateParams = {
      to_email: userData.email,
      user_name: userData.name,
      welcome_message: 'Welcome to Nawartu! We\'re excited to have you join our community.'
    };

    return emailJSService.sendEmail(templateParams);
  }
};

// SMS functionality removed - focusing on Google Maps and EmailJS only

// Simplified notification service - Email only
export const notificationService = {
  // Send email notification
  sendEmailNotification: async (notificationData) => {
    try {
      const result = await emailJSService.sendEmail(notificationData.emailParams);
      return {
        email: 'sent',
        emailData: result,
        status: 'success',
        message: 'Email sent successfully'
      };
    } catch (error) {
      return {
        email: 'failed',
        emailError: error.message,
        status: 'error',
        message: 'Failed to send email'
      };
    }
  },

  // Send booking confirmation email
  sendBookingNotifications: async (bookingData) => {
    try {
      const emailData = await emailJSService.sendBookingConfirmation(bookingData);
      return {
        email: emailData,
        status: 'success',
        message: 'Booking confirmation email sent successfully'
      };
    } catch (error) {
      return {
        email: null,
        error: error.message,
        status: 'error',
        message: 'Failed to send booking confirmation email'
      };
    }
  }
};

// Export default object for backward compatibility
const apiIntegrations = {
  googleMapsService,
  emailJSService,
  notificationService
};

export default apiIntegrations;