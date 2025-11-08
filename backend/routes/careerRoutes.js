import express from 'express';
const router = express.Router();
import {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
} from '../controllers/careerController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getCareers).post(protect, createCareer);
router
  .route('/:id')
  .get(getCareerById)
  .put(protect, updateCareer)
  .delete(protect, deleteCareer);

export default router;