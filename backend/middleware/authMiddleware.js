import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  const secret = process.env.JWT_SECRET;

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