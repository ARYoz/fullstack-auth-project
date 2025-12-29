import { verifyToken } from '../utils/jwt.js';


export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = req.headers.authorization?.split(' ')[1];
  try {
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;


    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

