// backend/controllers/appointmentController.js
import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';

/**
 * GET /api/appointments/my
 * Private (User) — current user's appointments
 */
export const getMyAppointments = asyncHandler(async (req, res) => {
  const list = await Appointment.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.json(list || []);
});

/**
 * GET /api/appointments/all
 * Private/Admin — all appointments
 */
/** GET /api/appointments/all (admin) */
export const getAllAppointments = asyncHandler(async (req, res) => {
  try {
    // First try: with populate (ideal if your Appointment.user ref points to model 'User')
    const list = await Appointment.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(list || []);
  } catch (e) {
    // If populate fails (bad ref/model name), log and fall back to non-populated query
    console.error('❌ getAllAppointments populate failed:', e?.message);

    try {
      const listNoPop = await Appointment.find({})
        .sort({ createdAt: -1 })
        .lean();

      // Add safe user fields if they exist on the document (name/email saved at create time)
      const hydrated = (listNoPop || []).map(a => ({
        ...a,
        user: a.user || null,  // raw ObjectId remains
        // name/email fields were set on createAppointment from req.user; show those if present
        _displayName: a.name || null,
        _displayEmail: a.email || null,
      }));

      return res.status(200).json(hydrated);
    } catch (inner) {
      console.error('❌ getAllAppointments (fallback) failed:', inner?.message);
      // Bubble to error middleware
      throw inner;
    }
  }
});


/**
 * GET /api/appointments/:id
 * Private — owner/admin
 */
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id)
    .populate('user', 'name email role')
    .lean();

  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Owner or Admin only
  const isOwner = appt.user?._id?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not allowed');
  }

  res.json(appt);
});

/**
 * POST /api/appointments
 * Private — create new appointment (user)
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const { date, time, mode, notes } = req.body;

  if (!date) {
    res.status(400);
    throw new Error('Date is required');
  }

  const appt = await Appointment.create({
    user: req.user._id,
    name: req.user.name,
    email: req.user.email,
    date,
    time: time || '',
    mode: mode || 'online',
    notes: notes || '',
    status: 'pending',
  });

  res.status(201).json(appt);
});

/**
 * PUT /api/appointments/:id
 * Private — owner/admin can update
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appt = await Appointment.findById(id);

  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const isOwner = appt.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not allowed');
  }

  const { date, time, mode, notes, status } = req.body;
  if (date) appt.date = date;
  if (time) appt.time = time;
  if (mode) appt.mode = mode;
  if (notes !== undefined) appt.notes = notes;
  if (status) appt.status = status;

  const updated = await appt.save();
  res.json(updated);
});

/**
 * PATCH /api/appointments/:id/cancel
 * Private — owner/admin can cancel
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const isOwner = appt.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not allowed');
  }

  appt.status = 'cancelled';
  await appt.save();
  res.json({ message: 'Appointment cancelled', appointment: appt });
});

/**
 * DELETE /api/appointments/:id
 * Private/Admin — delete appointment
 */
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin only');
  }
  await appt.deleteOne();
  res.json({ message: 'Appointment removed' });
});
