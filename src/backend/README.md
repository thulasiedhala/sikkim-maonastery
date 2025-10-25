# Sikkim Monasteries Backend API

A comprehensive Node.js/Express backend API for the Sikkim Monasteries cultural tourism platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Monastery Management**: CRUD operations for monastery data with reviews and ratings
- **Festival & Events**: Calendar system with livestream support
- **Booking System**: Unified booking for homestays, guides, workshops, and festivals
- **E-commerce**: Local artisan products with inventory management
- **Real-time Features**: Socket.io for chat and live notifications
- **File Upload**: Cloudinary integration for image management
- **Admin Dashboard**: Complete admin interface for content management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time**: Socket.io for websockets
- **File Storage**: Cloudinary for image/video uploads
- **Email**: Nodemailer for notifications
- **Payments**: Stripe integration (ready)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and setup**:
```bash
cd backend
npm install
```

2. **Environment Configuration**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**:
```bash
# Start MongoDB (if local)
mongod

# Seed the database with sample data
npm run seed
```

4. **Start Development Server**:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| POST | `/api/auth/change-password` | Change password | Private |

### Monastery Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/monasteries` | Get all monasteries | Public |
| GET | `/api/monasteries/:id` | Get monastery by ID | Public |
| POST | `/api/monasteries/:id/review` | Add review | Private |
| POST | `/api/monasteries/:id/favorite` | Toggle favorite | Private |

### Festival Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/festivals` | Get all festivals | Public |
| GET | `/api/festivals/:id` | Get festival by ID | Public |
| POST | `/api/festivals/:id/register` | Register for festival | Private |
| GET | `/api/festivals/calendar/:year/:month` | Calendar view | Public |

### Booking Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/bookings` | Create booking | Private |
| GET | `/api/bookings` | Get user bookings | Private |
| GET | `/api/bookings/:id` | Get booking details | Private |
| PUT | `/api/bookings/:id/status` | Update status | Private |

### Guide Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/guides` | Get all guides | Public |
| GET | `/api/guides/:id` | Get guide by ID | Public |
| POST | `/api/guides` | Create guide profile | Private |
| PUT | `/api/guides/profile` | Update guide profile | Guide |

## Database Models

### Core Models

- **User**: Authentication and user profiles
- **Monastery**: Monastery information and reviews
- **Festival**: Festival events with scheduling
- **Booking**: Unified booking system
- **Guide**: Guide profiles and services
- **Homestay**: Accommodation listings
- **Product**: E-commerce products

### Key Features

- **Geolocation**: Location-based monastery and guide search
- **Reviews & Ratings**: Comprehensive review system
- **Real-time**: Socket.io for live updates
- **File Upload**: Image handling with Cloudinary
- **Search**: Full-text search across content

## Deployment

### Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/sikkim-monasteries
JWT_SECRET=your_secure_jwt_secret

# Optional but recommended
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Production Deployment

1. **Build & Deploy**:
```bash
npm start
```

2. **Database Migration**:
```bash
npm run seed
```

3. **Health Check**:
```bash
curl http://your-domain.com/api/health
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Request throttling
- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Input Validation**: Request validation
- **Role-based Access**: Admin/Guide/Host permissions

## Real-time Features

- **Chat System**: User-guide communication
- **Livestream**: Festival livestream support
- **Notifications**: Real-time booking updates
- **Comments**: Live festival comments

## Admin Features

- **Content Management**: Full CRUD for all content
- **User Management**: User verification and roles
- **Analytics**: Booking and revenue statistics
- **Moderation**: Review and content moderation

## Sample Data

The seed script creates:
- Admin user (admin@sikkimmonasteries.com / admin123)
- 3 sample monasteries (Rumtek, Enchey, Tashiding)
- Sample festivals and events
- Guide and host user profiles
- Sample products and homestays

## Support

For development questions or issues:
1. Check the API documentation
2. Review the sample seed data
3. Test with the provided Postman collection
4. Check server logs for debugging

## License

This project is part of the Sikkim Monasteries cultural tourism platform.