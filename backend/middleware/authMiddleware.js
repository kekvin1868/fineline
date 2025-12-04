import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  const secret = process.env.AUTHENTIK_SECRET_KEY;

  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  // Get token from cookies or Authorization header
  token = req.cookies.appToken || 
          (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1] 
            : null
          );

  if (!token) {
    console.log('appToken not found in cookies or Authorization header');
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  try {
    // Verify JWT Token (appToken)
    const decoded = jwt.verify(token, secret);
    console.log('Decoded JWT:', decoded);

    // Find user in database
    req.user = await User.findByPk(decoded.userId);

    if (!req.user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    console.log('User authenticated:', req.user.username);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Failed to authorize.' });
  }
};

export { protect };