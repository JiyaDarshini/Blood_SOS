const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { sendError } = require('../utils/response');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Access denied. Invalid token format.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return sendError(res, 'Access denied. User not found.', 401);
    }

    if (user.status === 'DISABLED') {
      return sendError(res, 'Your account has been disabled. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please login again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token. Please login again.', 401);
    }
    console.error('Auth middleware error:', error);
    return sendError(res, 'Authentication failed.', 500);
  }
};

/**
 * Middleware to restrict access to admins only
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Authentication required.', 401);
  }
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};

/**
 * Middleware to optionally authenticate (for public routes that have extra features when logged in)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, fullName: true, email: true, role: true, status: true },
    });
    req.user = user && user.status === 'ACTIVE' ? user : null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth };
