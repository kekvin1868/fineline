import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  const secret = process.env.AUTHENTIK_SECRET_KEY;
  const AUTHENTIK_USERINFO_URL = process.env.AUTHENTIK_USERINFO_URL;

  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  if (!AUTHENTIK_USERINFO_URL || typeof AUTHENTIK_USERINFO_URL !== 'string' || AUTHENTIK_USERINFO_URL.trim() === '') {
    return res.status(500).json({ error: 'Server configuration missing: AUTHENTIK_USERINFO_URL' });
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      // Split headers to obtain token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, secret);

      // Get user from the token
      req.user = await User.findByPk(decoded.userId);

      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized, user not found." });
      }

      const authentikToken = req.headers['x-authentik-token']; // Custom header for Authentik token
      if (authentikToken) {
        const userInfoResponse = await axios.get(
          AUTHENTIK_USERINFO_URL,
          { headers: { Authorization: `Bearer ${authentikToken}` } }
        );

        if (!userInfoResponse.data || !userInfoResponse.data.sub) {
          return res.status(401).json({ error: 'Invalid Authentik token.' });
        }
      }

      next();
    } catch(error) {
      console.error("JWT verification failed: ", error.message);
      res.status(401).json({ error: "Unauthorized." });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export { protect };