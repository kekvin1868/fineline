import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- REGISTER USER --- //
router.post('/register', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    const userExists = await User.findOne({ where: { username } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const user = await User.create({
      username,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('Error registering user:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- LOGIN USER --- //
router.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('Error logging in user:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
