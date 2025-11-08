// backend/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// ✅ Shape helper ensures both role + isAdmin are sent
const shapeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || 'user',
  isAdmin: user.role === 'admin', // computed field
  token: generateToken(user._id),
});

// ✅ Login user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const shaped = shapeUser(user);
    console.log('✅ Sending user to frontend:', shaped);
    res.json(shaped);
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ✅ Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  const shaped = shapeUser(user);
  console.log('✅ New user created:', shaped);
  res.status(201).json(shaped);
});

export { authUser, registerUser };
