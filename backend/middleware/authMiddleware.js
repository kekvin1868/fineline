import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  const secret = process.env.AUTHENTIK_SECRET_KEY;
  const AUTHENTIK_USER_URL = process.env.AUTHENTIK_USER_URL;

  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  if (!AUTHENTIK_USER_URL || typeof AUTHENTIK_USER_URL !== 'string' || AUTHENTIK_USER_URL.trim() === '') {
    return res.status(500).json({ error: 'Server configuration missing: AUTHENTIK_USER_URL' });
  }

  // Get token from cookies
  token = req.cookies.appToken || (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1] 
    : null
  );

  if (!token) {
    console.log('`appToken` not found in cookies or headers');
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  try {
    // Verify JWT Token
    const decoded = jwt.verify(token, secret);
    console.log('Decoded JWT: ', decoded);

    req.user = await User.findByPk(decoded.userId);

    if (!req.user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const authentikToken = req.cookies.authentik_token;
    console.log('Authentik token:', authentikToken);

    if (!authentikToken) {
      console.log('Authentik token not found in cookies');
      return res.status(401).json({ error: 'Unauthorized: Authentik token required.' });
    }

    try {
      const userInfoResponse = await axios.get(AUTHENTIK_USER_URL, {
        headers: { Authorization: `Bearer ${authentikToken}` },
      });
      console.log('Authentik user info response:', userInfoResponse.data); // Debug

      if (!userInfoResponse.data || !userInfoResponse.data.sub) {
        console.log('Invalid Authentik user info:', userInfoResponse.data);
        return res.status(401).json({ error: 'Unauthorized: Invalid Authentik token.' });
      }
    } catch (authentikError) {
      console.error('Authentik API error:', authentikError.response?.data || authentikError.message);
      return res.status(401).json({ error: 'Unauthorized: Failed to validate Authentik token.' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Expired.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Failed to authorize.' });
  }
};

export { protect };