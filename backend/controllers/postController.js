import { asyncHandler } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import blueskyService from '../services/blueskyService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a new post
 */
export const createPost = asyncHandler(async (req, res) => {
  const { text, identifier } = req.body;

  // Validation
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Post text is required'
    });
  }

  if (text.length > 300) {
    return res.status(400).json({
      success: false,
      error: 'Post text must be 300 characters or less'
    });
  }

  if (!identifier) {
    return res.status(400).json({
      success: false,
      error: 'User identifier is required'
    });
  }

  // Check if user exists and is authenticated
  const user = await User.findOne({ identifier, isAuthenticated: true });
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated. Please login first.'
    });
  }

  // Get agent for this user
  const agent = blueskyService.getAgent(identifier);

  // Handle image upload if present
  let imagePath = null;
  if (req.file) {
    imagePath = req.file.path;
  }

  try {
    // Create post on Bluesky
    const response = await blueskyService.createPost(agent, text, imagePath);

    // Save post to database
    const post = new Post({
      userId: user._id,
      identifier: user.identifier,
      text: text.trim(),
      blueskyUri: response.uri,
      blueskyCid: response.cid,
      status: 'published',
      publishedAt: new Date(),
      hasImage: !!imagePath
    });
    await post.save();

    // Clean up uploaded file after successful post
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({
      success: true,
      message: 'Post published successfully',
      post: {
        id: post._id,
        text: post.text,
        blueskyUri: post.blueskyUri,
        publishedAt: post.publishedAt,
        hasImage: post.hasImage
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Save failed post to database
    try {
      const failedPost = new Post({
        userId: user._id,
        identifier: user.identifier,
        text: text.trim(),
        status: 'failed',
        errorMessage: error.message,
        hasImage: !!imagePath
      });
      await failedPost.save();
    } catch (dbError) {
      console.error('Failed to save error post:', dbError);
    }

    throw error;
  }
});

/**
 * Get user posts
 */
export const getUserPosts = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const { limit = 50, page = 1 } = req.query;

  const user = await User.findOne({ identifier });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const posts = await Post.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Post.countDocuments({ userId: user._id });

  res.json({
    success: true,
    posts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get user statistics
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const user = await User.findOne({ identifier });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const totalPosts = await Post.countDocuments({ userId: user._id });
  const publishedPosts = await Post.countDocuments({
    userId: user._id,
    status: 'published'
  });
  const failedPosts = await Post.countDocuments({
    userId: user._id,
    status: 'failed'
  });
  const postsWithImages = await Post.countDocuments({
    userId: user._id,
    hasImage: true
  });

  res.json({
    success: true,
    stats: {
      totalPosts,
      publishedPosts,
      failedPosts,
      postsWithImages,
      successRate: totalPosts > 0 ? ((publishedPosts / totalPosts) * 100).toFixed(2) : 0
    }
  });
});

