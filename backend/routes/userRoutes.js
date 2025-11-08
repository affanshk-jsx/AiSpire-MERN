// backend/routes/userRoutes.js
import express from 'express';
import { getUsers, getMe, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🧑‍💼 Get all users (admin or protected route)
router.get('/', protect, getUsers);

// 👤 Get currently logged-in user's profile
// -> GET /api/users/me
router.get('/me', protect, getMe);

// ✏️ (Optional) Update logged-in user's profile
// -> PUT /api/users/me
router.put('/me', protect, updateProfile);

export default router;
