import express from 'express';
import { createPost, getUserPosts, getUserStats } from '../controllers/postController.js';
import { checkDatabase } from '../middleware/errorHandler.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.post('/post', checkDatabase, uploadSingle, createPost);
router.get('/posts/:identifier', getUserPosts);
router.get('/stats/:identifier', getUserStats);

export default router;

