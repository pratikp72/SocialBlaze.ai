import pkg from '@atproto/api';
const { BskyAgent } = pkg;
import fs from 'fs';
import sharp from 'sharp';

/**
 * Bluesky Service
 * Handles all Bluesky API interactions
 */
class BlueskyService {
  constructor() {
    this.userAgents = new Map();
  }

  /**
   * Create and authenticate a Bluesky agent for a user
   */
  async authenticateUser(identifier, password) {
    try {
      const agent = new BskyAgent({
        service: 'https://bsky.social'
      });

      await agent.login({
        identifier,
        password
      });

      const session = agent.session;
      const did = session?.did;

      // Try to get user profile
      let displayName = identifier;
      let profileDid = did;

      try {
        if (did) {
          const profile = await agent.getProfile({ actor: did });
          displayName = profile.data.displayName || identifier;
          profileDid = profile.data.did || did;
        }
      } catch (profileError) {
        console.log('Profile fetch failed, using session data:', profileError.message);
      }

      // Store agent for this user session
      this.userAgents.set(identifier, agent);

      return {
        agent,
        session: {
          did: profileDid,
          displayName,
          identifier
        }
      };
    } catch (error) {
      throw new Error(`Bluesky authentication failed: ${error.message}`);
    }
  }

  /**
   * Get agent for authenticated user
   */
  getAgent(identifier) {
    const agent = this.userAgents.get(identifier);
    if (!agent) {
      throw new Error('Session expired. Please login again.');
    }
    return agent;
  }

  /**
   * Upload image to Bluesky
   */
  async uploadImage(agent, imagePath) {
    try {
      // Read and process image
      const imageBuffer = await fs.promises.readFile(imagePath);
      
      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Resize image if too large (Bluesky recommends max 2000x2000)
      let processedImage = imageBuffer;
      if (metadata.width > 2000 || metadata.height > 2000) {
        processedImage = await sharp(imageBuffer)
          .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85 })
          .toBuffer();
      }

      // Convert Buffer to Uint8Array to ensure compatibility with fetch
      const imageUint8Array = new Uint8Array(processedImage);

      // Upload to Bluesky
      const uploadResponse = await agent.uploadBlob(imageUint8Array, {
        encoding: 'image/jpeg'
      });

      return uploadResponse.data;
    } catch (error) {
      console.error('Image upload error details:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  /**
   * Create a post with optional image
   */
  async createPost(agent, text, imagePath = null) {
    try {
      const postData = {
        text: text.trim(),
        createdAt: new Date().toISOString()
      };

      // Add image if provided
      if (imagePath) {
        const imageBlob = await this.uploadImage(agent, imagePath);
        postData.embed = {
          $type: 'app.bsky.embed.images',
          images: [
            {
              image: imageBlob.blob,
              alt: text.trim().substring(0, 1000) || 'Image' // Alt text for accessibility
            }
          ]
        };
      }

      const response = await agent.post(postData);
      return response;
    } catch (error) {
      throw new Error(`Post creation failed: ${error.message}`);
    }
  }

  /**
   * Remove user session
   */
  removeSession(identifier) {
    this.userAgents.delete(identifier);
  }

  /**
   * Get active sessions count
   */
  getActiveSessionsCount() {
    return this.userAgents.size;
  }
}

export default new BlueskyService();

