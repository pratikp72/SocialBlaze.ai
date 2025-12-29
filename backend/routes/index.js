import express from 'express';
import authRoutes from './authRoutes.js';
import postRoutes from './postRoutes.js';

const router = express.Router();

router.use('/bluesky', authRoutes);
router.use('/bluesky', postRoutes);

export default router;

