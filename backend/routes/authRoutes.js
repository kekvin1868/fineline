import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const AUTHENTIK_URL = process.env.AUTHENTIK_URL;
const AUTHENTIK_SECRET_KEY = process.env.AUTHENTIK_SECRET_KEY;
const CLIENT_ID = process.env.AUTHENTIK_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTHENTIK_CLIENT_SECRET;
const AUTHENTIK_API_TOKEN = process.env.AUTHENTIK_API_TOKEN;

// Generate JWT
const generateToken = (id) => {
  if (!AUTHENTIK_SECRET_KEY) {
    throw new Error('Configuration is undefined or not configured.');
  }

  return jwt.sign({ userId: id }, AUTHENTIK_SECRET_KEY, {
    expiresIn: '30d',
  });
};

// --- REGISTER USER --- //
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const payload = {
      username: username,
      name: username, // 'name' is a required field
      password: password,
      path: 'users',
      type: 'external',
      is_active: true,
    };

    if (email) {
      payload.email = email;
    }

    await axios.post(
      `${AUTHENTIK_URL}/api/v3/core/users/`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${AUTHENTIK_API_TOKEN}`,
        },
      }
    );

    const user = await User.create({
      username,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return res.status(400).json({ error: 'User already exists in Authentik.' });
    }
    console.error('Error registering user:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- LOGIN USER --- //
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Credentials are required.' });
  }

  try {
    const response = await axios.post(`${AUTHENTIK_URL}/application/o/token/`, {
      grant_type: 'password',
      username,
      password,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const { access_token } = response.data;

    // Find or create the user in the local database
    let user = await User.findOne({ where: { username } });
    if (!user) {
      user = await User.create({ username });
    }

    const appToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({ token: appToken, authentikToken: access_token });
  } catch (err) {
    console.error('Error logging in user:', err.stack);
    if (err.response && (err.response.status === 401 || err.response.status === 400)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
