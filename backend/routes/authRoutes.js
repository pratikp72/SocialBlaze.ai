import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { checkDatabase } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/login', checkDatabase, login);
router.post('/logout', logout);

export default router;

