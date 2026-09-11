const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/contacts
 * Log a contact attempt
 */
const logContact = async (req, res) => {
  try {
    const { sosId, donorId, channel } = req.body;

    // Verify SOS exists
    const sos = await prisma.sOSRequest.findUnique({ where: { id: sosId } });
    if (!sos) return sendError(res, 'SOS request not found.', 404);

    // Verify donor exists
    const donor = await prisma.donor.findUnique({ where: { id: donorId } });
    if (!donor) return sendError(res, 'Donor not found.', 404);

    const log = await prisma.contactLog.create({
      data: {
        sosId,
        donorId,
        userId: req.user.id,
        channel,
      },
      include: {
        donor: {
          include: { user: { select: { fullName: true, phone: true } } },
        },
        sos: { select: { hospitalName: true, bloodGroup: true } },
      },
    });

    return sendSuccess(res, { log }, 'Contact logged successfully.', 201);
  } catch (error) {
    console.error('LogContact error:', error);
    return sendError(res, 'Failed to log contact.', 500);
  }
};

/**
 * GET /api/contacts
 * Get contact history for current user
 */
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.contactLog.findMany({
        where: { userId: req.user.id },
        skip,
        take: parseInt(limit),
        orderBy: { contactedAt: 'desc' },
        include: {
          donor: {
            include: { user: { select: { fullName: true, phone: true } } },
          },
          sos: {
            select: {
              id: true,
              hospitalName: true,
              bloodGroup: true,
              urgency: true,
              city: true,
            },
          },
        },
      }),
      prisma.contactLog.count({ where: { userId: req.user.id } }),
    ]);

    return sendSuccess(res, {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('GetContacts error:', error);
    return sendError(res, 'Failed to retrieve contact history.', 500);
  }
};

module.exports = { logContact, getContacts };
