// backend/controllers/assessmentController.js
import asyncHandler from 'express-async-handler';
import Assessment from '../models/Assessment.js'; // matches your file name in /models

// @desc   Get current user's assessments/quiz results
// @route  GET /api/assessments/my
// @access Private
export const getMyAssessments = asyncHandler(async (req, res) => {
  const items = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// @desc   Get all assessments/results (adjust access as needed)
// @route  GET /api/assessments
// @access Private (or Admin)
export const getAssessments = asyncHandler(async (_req, res) => {
  const items = await Assessment.find().sort({ createdAt: -1 });
  res.json(items);
});

// @desc   Get single assessment/result
// @route  GET /api/assessments/:id
// @access Private
export const getAssessmentById = asyncHandler(async (req, res) => {
  const item = await Assessment.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Assessment not found');
  }
  res.json(item);
});

// (Optional) Save/submit a quiz result
// @route  POST /api/assessments/submit
// @access Private
export const createAssessmentResult = asyncHandler(async (req, res) => {
  const { title, score, total } = req.body;

  const created = await Assessment.create({
    user: req.user._id,
    title: title || 'Assessment',
    score: Number(score) ?? 0,
    total: Number(total) ?? 100,
  });

  res.status(201).json(created);
});
