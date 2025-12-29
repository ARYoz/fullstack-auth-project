import jwt from 'jsonwebtoken';
import 'dotenv/config';


const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env file');
  }
  return secret;
};


const getJWTExpiry = () => {
  return process.env.JWT_EXPIRY;
};


export const generateToken = (payload) => {
  const secret = getJWTSecret();
  const expiry = getJWTExpiry();
  
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};


export const verifyToken = (token) => {
  try {
    const secret = getJWTSecret();
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

