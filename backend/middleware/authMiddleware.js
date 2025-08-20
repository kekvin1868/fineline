import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  const secret = process.env.JWT_SECRET;
  const AUTHENTIK_INTROSPECTION_URL = process.env.AUTHENTIK_INTROSPECTION_URL;
  const CLIENT_ID = process.env.AUTHENTIK_CLIENT_ID;
  const CLIENT_SECRET = process.env.AUTHENTIK_CLIENT_SECRET;

  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    return res.status(500).json({ error: 'Server configuration missing' });
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
        const introspectionResponse = await axios.post(
          AUTHENTIK_INTROSPECTION_URL,
          new URLSearchParams({
            token: authentikToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (!introspectionResponse.data.active) {
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