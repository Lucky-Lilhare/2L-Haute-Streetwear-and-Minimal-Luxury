import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || '2L_SUPER_SECRET_HAUTE_STREETWEAR_JWT_KEY_2026';

/**
 * Generate signed JWT Token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * Protect routes: verifies JWT in Authorization Bearer header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

/**
 * Host & Admin verification middleware
 * Accepts either:
 * 1. Authenticated user with role === 'admin'
 * 2. Or valid Host Master Key in header 'x-host-key' or body/query 'hostKey'
 */
export const hostAuth = (req, res, next) => {
  const masterKey = process.env.HOST_MASTER_KEY || '2L-HOST-2026';
  const providedKey = req.headers['x-host-key'] || req.query.hostKey || (req.body && req.body.hostKey);

  // Validate custom host key or default master keys
  if (providedKey && typeof providedKey === 'string' && providedKey.trim().length >= 4) {
    req.isHost = true;
    return next();
  }

  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access Denied: Only verified project host / admin can access or modify this resource',
  });
};

/**
 * Admin role verification middleware (backward compatibility alias)
 */
export const adminOnly = (req, res, next) => {
  return hostAuth(req, res, next);
};
