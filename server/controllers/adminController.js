const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/admin/dashboard
 * Admin statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers, totalDonors, availableDonors,
      activeSOS, criticalSOS, fulfilledSOS, totalContacts,
      recentSOS, recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.donor.count(),
      prisma.donor.count({ where: { isAvailable: true } }),
      prisma.sOSRequest.count({ where: { status: 'ACTIVE' } }),
      prisma.sOSRequest.count({ where: { status: 'ACTIVE', urgency: 'CRITICAL' } }),
      prisma.sOSRequest.count({ where: { status: 'FULFILLED' } }),
      prisma.contactLog.count(),
      prisma.sOSRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { requester: { select: { fullName: true } } },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return sendSuccess(res, {
      stats: {
        totalUsers, totalDonors, availableDonors,
        activeSOS, criticalSOS, fulfilledSOS, totalContacts,
      },
      recentSOS,
      recentUsers,
    });
  } catch (error) {
    console.error('AdminDashboard error:', error);
    return sendError(res, 'Failed to retrieve admin statistics.', 500);
  }
};

/**
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, fullName: true, email: true, phone: true,
          role: true, status: true, createdAt: true,
          _count: { select: { sosRequests: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return sendSuccess(res, {
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('AdminGetUsers error:', error);
    return sendError(res, 'Failed to retrieve users.', 500);
  }
};

/**
 * PUT /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: { id: true, fullName: true, status: true },
    });
    return sendSuccess(res, { user }, `User ${status === 'ACTIVE' ? 'enabled' : 'disabled'} successfully.`);
  } catch (error) {
    console.error('AdminUpdateUserStatus error:', error);
    return sendError(res, 'Failed to update user status.', 500);
  }
};

/**
 * GET /api/admin/donors
 */
const getAllDonors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { registeredAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true, email: true, phone: true, status: true } },
        },
      }),
      prisma.donor.count(),
    ]);

    return sendSuccess(res, {
      donors,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('AdminGetDonors error:', error);
    return sendError(res, 'Failed to retrieve donors.', 500);
  }
};

/**
 * GET /api/admin/sos
 */
const getAllSOS = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, urgency } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;

    const [sos, total] = await Promise.all([
      prisma.sOSRequest.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { fullName: true, email: true } },
          _count: { select: { contactLogs: true } },
        },
      }),
      prisma.sOSRequest.count({ where }),
    ]);

    return sendSuccess(res, {
      sos,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('AdminGetSOS error:', error);
    return sendError(res, 'Failed to retrieve SOS requests.', 500);
  }
};

/**
 * PUT /api/admin/sos/:id/close
 */
const adminCloseSOS = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.update({
      where: { id: req.params.id },
      data: { status: 'CLOSED' },
    });
    return sendSuccess(res, { sos }, 'SOS request closed by admin.');
  } catch (error) {
    console.error('AdminCloseSOS error:', error);
    return sendError(res, 'Failed to close SOS request.', 500);
  }
};

/**
 * GET /api/admin/contacts
 */
const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.contactLog.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { contactedAt: 'desc' },
        include: {
          donor: { include: { user: { select: { fullName: true } } } },
          user: { select: { fullName: true, email: true } },
          sos: { select: { hospitalName: true, bloodGroup: true, urgency: true } },
        },
      }),
      prisma.contactLog.count(),
    ]);

    return sendSuccess(res, {
      logs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('AdminGetContacts error:', error);
    return sendError(res, 'Failed to retrieve contact logs.', 500);
  }
};

module.exports = {
  getDashboardStats, getAllUsers, updateUserStatus,
  getAllDonors, getAllSOS, adminCloseSOS, getAllContacts,
};
