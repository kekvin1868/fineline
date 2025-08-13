import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const protect = (req, res, next) => {
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

      // Attach decoded data to request object
      req.user = { id: decoded.userId };

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