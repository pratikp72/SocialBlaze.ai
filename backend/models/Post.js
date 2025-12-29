import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  identifier: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 300
  },
  blueskyUri: {
    type: String,
    trim: true
  },
  blueskyCid: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'failed'],
    default: 'published'
  },
  errorMessage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  hasImage: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    trim: true
  }
});

export default mongoose.model('Post', postSchema);

