# SocialBlaze - Bluesky Integration

A React frontend and Node.js backend application that allows you to post to Bluesky from your SocialBlaze platform.

## Features

- 🔐 Authenticate with Bluesky using handle and App Password
- ✍️ Create and post content to Bluesky
- 🖼️ **Upload and post images** (JPEG, PNG, GIF, WebP)
- 💾 MongoDB database to store users and posts
- 📊 Track post history and statistics
- 🎨 Modern, responsive UI with image preview
- ⚡ Fast and efficient API integration
- 🏗️ Professional MVC architecture
- 🛡️ Comprehensive error handling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Compass)
- A Bluesky account with an App Password

## Getting Started

### 1. Get Your Bluesky App Password

1. Go to [Bluesky Settings](https://bsky.app/settings)
2. Navigate to **App Passwords** section
3. Create a new App Password
4. Copy the generated password (you'll need it for authentication)

### 2. MongoDB Setup

Make sure MongoDB is running on your system. If you're using MongoDB Compass, ensure the MongoDB service is running.

Default connection: `mongodb://localhost:27017/socialblaze`

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialblaze
```

If your MongoDB is running on a different port or host, update `MONGODB_URI` accordingly.

Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter your Bluesky handle (e.g., `yourhandle.bsky.social`)
3. Enter your App Password
4. Click "Connect to Bluesky"
5. Once connected, write your post (max 300 characters)
6. (Optional) Upload an image by clicking the image upload area
7. Click "Post to Bluesky" to publish

## API Endpoints

### POST `/api/bluesky/login`
Authenticate with Bluesky.

**Request Body:**
```json
{
  "identifier": "yourhandle.bsky.social",
  "password": "your-app-password"
}
```

### POST `/api/bluesky/post`
Post content to Bluesky (requires authentication). Supports text and image posts.

**Request Body (multipart/form-data):**
- `text`: Post content (required, max 300 characters)
- `identifier`: User identifier (required)
- `image`: Image file (optional, max 5MB, formats: JPEG, PNG, GIF, WebP)

### GET `/api/posts/:identifier`
Get all posts for a user.

### GET `/api/stats/:identifier`
Get posting statistics for a user.

### GET `/api/health`
Check server status, database connection, and active sessions.

## Project Structure

Professional MVC architecture with separation of concerns:

```
socialblaze/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── postController.js  # Post management
│   ├── middleware/
│   │   ├── errorHandler.js    # Error handling
│   │   └── upload.js          # File upload (multer)
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Post.js            # Post schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── postRoutes.js      # Post routes
│   │   └── index.js           # Route aggregator
│   ├── services/
│   │   └── blueskyService.js  # Bluesky API service
│   └── uploads/               # Temporary image storage
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css             # Component styles
│   │   └── index.js            # React entry point
│   └── public/
└── README.md
```

See `PROJECT_STRUCTURE.md` for detailed architecture documentation.

## Technologies Used

- **Backend**: 
  - Node.js, Express
  - @atproto/api (Bluesky SDK)
  - MongoDB, Mongoose
  - Multer (file upload)
  - Sharp (image processing)
- **Frontend**: 
  - React
  - Axios
- **Database**: MongoDB
- **API**: Bluesky ATProto API

## Database Schema

### User Collection
- `identifier`: Bluesky handle (unique)
- `displayName`: User's display name
- `did`: Decentralized identifier
- `isAuthenticated`: Authentication status
- `lastLogin`: Last login timestamp
- `createdAt`, `updatedAt`: Timestamps

### Post Collection
- `userId`: Reference to User
- `identifier`: User's Bluesky handle
- `text`: Post content
- `blueskyUri`: URI of the post on Bluesky
- `blueskyCid`: Content ID from Bluesky
- `status`: Post status (published, failed, pending)
- `errorMessage`: Error message if post failed
- `hasImage`: Boolean indicating if post has image
- `imageUrl`: URL of uploaded image (if any)
- `createdAt`, `publishedAt`: Timestamps

## Notes

- Posts are limited to 300 characters (Bluesky's limit)
- Images are automatically resized to max 2000x2000px
- Image file size limit: 5MB
- Supported image formats: JPEG, PNG, GIF, WebP
- You must authenticate before posting
- All posts are saved to MongoDB for history tracking
- User sessions are stored in memory (resets on server restart)
- Failed posts are also saved to the database with error messages
- Images are temporarily stored and cleaned up after posting

## License

MIT

