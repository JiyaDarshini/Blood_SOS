const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

const SALT_ROUNDS = 12;

/**
 * GET /api/users/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        donor: {
          select: {
            id: true,
            bloodGroup: true,
            locality: true,
            city: true,
            pincode: true,
            isAvailable: true,
            registeredAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) return sendError(res, 'User not found.', 404);
    return sendSuccess(res, { user }, 'Profile retrieved successfully.');
  } catch (error) {
    console.error('GetProfile error:', error);
    return sendError(res, 'Failed to retrieve profile.', 500);
  }
};

/**
 * PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, locality, city, pincode, bloodGroup } = req.body;

    // Check phone uniqueness if changing
    if (phone && phone !== req.user.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone, id: { not: req.user.id } },
      });
      if (existingPhone) {
        return sendError(res, 'Phone number is already in use.', 409, [
          { field: 'phone', message: 'Phone number already registered.' },
        ]);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    // Update donor profile if exists
    if (locality || city || pincode || bloodGroup) {
      const existingDonor = await prisma.donor.findUnique({
        where: { userId: req.user.id },
      });
      if (existingDonor) {
        await prisma.donor.update({
          where: { userId: req.user.id },
          data: {
            ...(locality && { locality }),
            ...(city && { city }),
            ...(pincode && { pincode }),
            ...(bloodGroup && { bloodGroup }),
          },
        });
      }
    }

    return sendSuccess(res, { user: updatedUser }, 'Profile updated successfully.');
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return sendError(res, 'Failed to update profile.', 500);
  }
};

/**
 * PUT /api/users/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { passwordHash: true },
    });

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return sendError(res, 'Current password is incorrect.', 401, [
        { field: 'currentPassword', message: 'Current password is incorrect.' },
      ]);
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newHash },
    });

    return sendSuccess(res, {}, 'Password changed successfully.');
  } catch (error) {
    console.error('ChangePassword error:', error);
    return sendError(res, 'Failed to change password.', 500);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
