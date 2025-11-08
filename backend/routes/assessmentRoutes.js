// backend/routes/assessmentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMyAssessments,
  getAssessments,
  getAssessmentById,
  createAssessmentResult, // optional, used by POST /submit
} from '../controllers/assessmentController.js';

const router = express.Router();

// Current user's assessments/results
router.get('/my', protect, getMyAssessments);

// (Optional) All results/assessments
router.get('/', protect, getAssessments);

// (Optional) One result/assessment
router.get('/:id', protect, getAssessmentById);

// (Optional) Create/save a result
router.post('/submit', protect, createAssessmentResult);

export default router;
