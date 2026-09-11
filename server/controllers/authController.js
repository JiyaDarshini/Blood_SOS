const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

const SALT_ROUNDS = 12;
const JWT_EXPIRY = '7d';

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, bloodGroup, locality, city, pincode, role } = req.body;

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return sendError(res, 'This email address is already registered.', 409, [
        { field: 'email', message: 'Email already registered.' },
      ]);
    }

    // Check for existing phone
    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return sendError(res, 'This phone number is already registered.', 409, [
        { field: 'phone', message: 'Phone number already registered.' },
      ]);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        role: role || 'REQUESTER',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // If role is DONOR or BOTH, create donor profile
    if (role === 'DONOR' || role === 'BOTH') {
      if (bloodGroup && locality && city && pincode) {
        await prisma.donor.create({
          data: {
            userId: user.id,
            bloodGroup,
            locality,
            city,
            pincode,
            isAvailable: true,
          },
        });
      }
    }

    const token = generateToken(user.id);

    return sendSuccess(
      res,
      { user, token },
      'Registration successful. Welcome to BloodSOS!',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, 'Registration failed. Please try again.', 500);
  }
};

/**
 * POST /api/auth/login
 * Login user
 */
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone },
        ],
      },
      include: {
        donor: true,
      },
    });

    if (!user) {
      return sendError(res, 'Invalid credentials. Please check your email/phone and password.', 401);
    }

    if (user.status === 'DISABLED') {
      return sendError(res, 'Your account has been disabled. Please contact support.', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials. Please check your email/phone and password.', 401);
    }

    const token = generateToken(user.id);

    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      donor: user.donor,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, { user: userData, token }, 'Login successful. Welcome back!');
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'Login failed. Please try again.', 500);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { donor: true },
      omit: { passwordHash: true },
    });

    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    return sendSuccess(res, { user }, 'User profile retrieved.');
  } catch (error) {
    console.error('GetMe error:', error);
    return sendError(res, 'Failed to retrieve user profile.', 500);
  }
};

/**
 * POST /api/auth/logout
 * Logout (client-side token removal; included for API completeness)
 */
const logout = (req, res) => {
  return sendSuccess(res, {}, 'Logged out successfully.');
};

module.exports = { register, login, getMe, logout };
