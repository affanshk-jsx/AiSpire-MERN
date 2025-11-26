import asyncHandler from 'express-async-handler';
import Career from '../models/Career.js';
import Appointment from '../models/Appointment.js';
import User from '../models/userModel.js';
import Assessment from '../models/Assessment.js';

export const adminHealth = asyncHandler(async (_req, res) => {
  res.json({ ok: true });
});

/* ===== Careers ===== */
export const adminListCareers = asyncHandler(async (_req, res) => {
  const items = await Career.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const adminCreateCareer = asyncHandler(async (req, res) => {
  const { title, description, avgSalary, skills = [] } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
  const created = await Career.create({
    title,
    description: description || '',
    avgSalary: avgSalary || '',
    skills,
  });
  res.status(201).json(created);
});

export const adminUpdateCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const c = await Career.findById(id);
  if (!c) {
    res.status(404);
    throw new Error('Career not found');
  }
  const { title, description, avgSalary, skills } = req.body;
  if (title !== undefined) c.title = title;
  if (description !== undefined) c.description = description;
  if (avgSalary !== undefined) c.avgSalary = avgSalary;
  if (skills !== undefined) c.skills = skills;
  const updated = await c.save();
  res.json(updated);
});

export const adminDeleteCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const c = await Career.findById(id);
  if (!c) {
    res.status(404);
    throw new Error('Career not found');
  }
  await c.deleteOne();
  res.json({ message: 'Career deleted' });
});

/* ===== Appointments ===== */
export const adminListAppointments = asyncHandler(async (_req, res) => {
  const list = await Appointment.find({})
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
  res.json(list || []);
});

export const adminUpdateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'pending' | 'confirmed' | 'cancelled' | 'completed'
  const appt = await Appointment.findById(id);
  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (status) appt.status = status;
  const updated = await appt.save();
  res.json(updated);
});

export const adminDeleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appt = await Appointment.findById(id);
  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  await appt.deleteOne();
  res.json({ message: 'Appointment removed' });
});

/* ===== Users ===== */
export const adminListUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const adminUpdateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // 'user' | 'admin'
  const u = await User.findById(id);
  if (!u) {
    res.status(404);
    throw new Error('User not found');
  }
  if (!['user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }
  u.role = role;
  const updated = await u.save();
  res.json(updated);
});

/* ===== Assessments ===== */
export const adminListAssessments = asyncHandler(async (_req, res) => {
  const items = await Assessment.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(items);
});

export const adminDeleteAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Assessment.findById(id);
  if (!item) {
    res.status(404);
    throw new Error('Assessment not found');
  }
  await item.deleteOne();
  res.json({ message: 'Assessment deleted' });
});