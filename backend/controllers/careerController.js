import asyncHandler from 'express-async-handler';
import Career from '../models/Career.js';

const getCareers = asyncHandler(async (req, res) => {
  const careers = await Career.find({});
  res.json(careers);
});

const getCareerById = asyncHandler(async (req, res) => {
  const career = await Career.findById(req.params.id);

  if (career) {
    res.json(career);
  } else {
    res.status(404);
    throw new Error('Career not found');
  }
});

// @desc    Create a career (Admin only)
// @route   POST /api/careers
// @access  Private/Admin
const createCareer = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }

  const { title, description, averageSalary, educationRequired, skills, relatedFields } = req.body;

  const career = new Career({
    title: title || 'Sample Title',
    description: description || 'Sample description.',
    averageSalary: averageSalary || 0,
    educationRequired: educationRequired || 'Not specified',
    skills: skills || [],
    relatedFields: relatedFields || [],
  });

  const createdCareer = await career.save();
  res.status(201).json(createdCareer);
});

// @desc    Update a career (Admin only)
// @route   PUT /api/careers/:id
// @access  Private/Admin
const updateCareer = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }

  const { title, description, averageSalary, educationRequired, skills, relatedFields } = req.body;
  const career = await Career.findById(req.params.id);

  if (career) {
    career.title = title || career.title;
    career.description = description || career.description;
    career.averageSalary = averageSalary ?? career.averageSalary;
    career.educationRequired = educationRequired || career.educationRequired;
    career.skills = skills || career.skills;
    career.relatedFields = relatedFields || career.relatedFields;

    const updatedCareer = await career.save();
    res.json(updatedCareer);
  } else {
    res.status(404);
    throw new Error('Career not found');
  }
});

// @desc    Delete a career (Admin only)
// @route   DELETE /api/careers/:id
// @access  Private/Admin
const deleteCareer = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
  
  const career = await Career.findById(req.params.id);

  if (career) {
    await career.deleteOne();
    res.json({ message: 'Career removed' });
  } else {
    res.status(404);
    throw new Error('Career not found');
  }
});

export { getCareers, getCareerById, createCareer, updateCareer, deleteCareer };