import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  adminListCareers,
  adminCreateCareer,
  adminUpdateCareer,
  adminDeleteCareer,
  adminListAppointments,
  adminUpdateAppointmentStatus,
  adminDeleteAppointment,
  adminListUsers,
  adminUpdateUserRole,
  adminListAssessments,
  adminDeleteAssessment,
  adminHealth,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require auth + admin
router.use(protect, admin);

// simple health check
router.get('/health', adminHealth);

/** Careers CRUD */
router.get('/careers', adminListCareers);
router.post('/careers', adminCreateCareer);
router.put('/careers/:id', adminUpdateCareer);
router.delete('/careers/:id', adminDeleteCareer);

/** Appointments manage */
router.get('/appointments', adminListAppointments);
router.patch('/appointments/:id/status', adminUpdateAppointmentStatus);
router.delete('/appointments/:id', adminDeleteAppointment);

/** Users manage */
router.get('/users', adminListUsers);
router.patch('/users/:id/role', adminUpdateUserRole);

/** Assessments manage */
router.get('/assessments', adminListAssessments);
router.delete('/assessments/:id', adminDeleteAssessment);

export default router;