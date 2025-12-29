# Project Structure

This project follows a professional MVC (Model-View-Controller) architecture pattern.

## Backend Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js   # Authentication logic (login/logout)
│   └── postController.js   # Post creation and management
├── middleware/
│   ├── errorHandler.js     # Global error handling middleware
│   └── upload.js           # File upload configuration (multer)
├── models/
│   ├── User.js             # User schema/model
│   └── Post.js             # Post schema/model
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── postRoutes.js       # Post routes
│   └── index.js            # Route aggregator
├── services/
│   └── blueskyService.js   # Bluesky API service layer
├── uploads/                # Temporary image storage (gitignored)
├── server.js               # Express app entry point
└── package.json
```

## Frontend Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Component styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
└── package.json
```

## Architecture Patterns

### Backend
- **MVC Pattern**: Separation of concerns with Models, Views (API responses), and Controllers
- **Service Layer**: Business logic separated into services (blueskyService)
- **Middleware**: Error handling, validation, file upload
- **Route-based**: Organized route files for different features

### Key Features
- ✅ Professional code structure
- ✅ Error handling with async wrapper
- ✅ Image upload with validation
- ✅ Database models with Mongoose
- ✅ Service layer abstraction
- ✅ Clean separation of concerns

