// backend/routes/appointmentRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

/** ---------- Non-param routes FIRST ---------- */

// User routes
router.get('/my', protect, getMyAppointments);
router.post('/', protect, createAppointment);

// Admin route (MUST be before "/:id")
router.get('/all', protect, admin, getAllAppointments);

/** ---------- Param routes AFTER ---------- */
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.patch('/:id/cancel', protect, cancelAppointment);
router.delete('/:id', protect, deleteAppointment);

export default router;
