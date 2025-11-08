import express from 'express';
const router = express.Router();
// Controller se 'authUser' aur 'registerUser' import karein
import { authUser, registerUser } from '../controllers/authController.js';

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', authUser);

export default router;