# Nawartu Backend API
mother my head hurts
someone get me yerba matte 
A complete MERN stack backend for Nawartu - Damascus Airbnb Clone.

## Features

- **User Authentication** - JWT-based authentication with user roles
- **Property Management** - CRUD operations for property listings
- **Booking System** - Complete booking and reservation management
- **Review System** - Property reviews and ratings
- **Search & Filtering** - Advanced search with multiple filters
- **File Upload** - Image upload support (ready for implementation)
- **Admin Panel** - User management and system administration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/become-host` - Become a host

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property (host only)
- `PUT /api/properties/:id` - Update property (host only)
- `DELETE /api/properties/:id` - Delete property (host only)
- `POST /api/properties/:id/reviews` - Add review to property
- `GET /api/properties/neighborhoods/list` - Get neighborhoods list
- `POST /api/properties/:id/favorite` - Toggle favorite property

### Bookings
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/my-properties-bookings` - Get host's bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/review` - Add review to booking
- `GET /api/bookings/property/:propertyId/availability` - Check availability

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/properties` - Get user's properties
- `GET /api/users/me/favorites` - Get user's favorites
- `GET /api/users/me/stats` - Get user statistics
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/nawartu
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env file

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Database Models

### User
- Basic info (name, email, password)
- Role-based access (user, host, admin)
- Favorites list
- Profile management

### Property
- Property details (title, description, location)
- Pricing and availability
- Amenities and capacity
- Reviews and ratings
- Host information

### Booking
- Guest and host information
- Check-in/check-out dates
- Booking status and payment
- Reviews and ratings

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

## Development

- **nodemon** - Auto-restart on file changes
- **CORS enabled** - Frontend can connect from different origins
- **Validation** - Input validation and error handling
- **Security** - Password hashing, JWT tokens, role-based access

## Next Steps

1. **File Upload** - Implement image upload for properties
2. **Payment Integration** - Add Stripe/PayPal for payments
3. **Email Notifications** - Send booking confirmations
4. **Real-time Features** - Add Socket.io for live messaging
5. **Search Optimization** - Implement Elasticsearch
6. **Caching** - Add Redis for performance
7. **Testing** - Add unit and integration tests 