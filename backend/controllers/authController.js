import { asyncHandler } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import blueskyService from '../services/blueskyService.js';

/**
 * Authenticate user with Bluesky
 */
export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Identifier and password are required'
    });
  }

  // Authenticate with Bluesky
  const { session } = await blueskyService.authenticateUser(identifier, password);

  // Save or update user in database
  let user = await User.findOne({ identifier });
  if (!user) {
    user = new User({
      identifier: session.identifier,
      displayName: session.displayName,
      did: session.did,
      isAuthenticated: true,
      lastLogin: new Date()
    });
  } else {
    user.isAuthenticated = true;
    user.lastLogin = new Date();
    user.displayName = session.displayName !== session.identifier ? session.displayName : user.displayName;
    user.did = session.did || user.did;
  }
  await user.save();

  res.json({
    success: true,
    message: 'Successfully authenticated with Bluesky',
    user: {
      identifier: user.identifier,
      displayName: user.displayName,
      did: user.did
    }
  });
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req, res) => {
  const { identifier } = req.body;

  if (identifier) {
    // Update user in database
    await User.findOneAndUpdate(
      { identifier },
      { isAuthenticated: false }
    );

    // Remove session
    blueskyService.removeSession(identifier);
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

