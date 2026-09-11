const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/sos
 * Create an SOS request
 */
const createSOS = async (req, res) => {
  try {
    const {
      bloodGroup, unitsRequired, hospitalName, hospitalAddress,
      locality, city, urgency, contactNumber, message,
    } = req.body;

    const sos = await prisma.sOSRequest.create({
      data: {
        requesterId: req.user.id,
        bloodGroup,
        unitsRequired: parseInt(unitsRequired) || 1,
        hospitalName,
        hospitalAddress,
        locality,
        city,
        urgency: urgency || 'URGENT',
        contactNumber,
        message: message || null,
        status: 'ACTIVE',
      },
      include: {
        requester: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });

    return sendSuccess(res, { sos }, 'SOS request broadcast successfully. Matching donors have been notified.', 201);
  } catch (error) {
    console.error('CreateSOS error:', error);
    return sendError(res, 'Failed to broadcast SOS request.', 500);
  }
};

/**
 * GET /api/sos
 * Get SOS requests with filters
 */
const getSOSRequests = async (req, res) => {
  try {
    const { bloodGroup, locality, city, urgency, status, page = 1, limit = 20, sort = 'newest' } = req.query;

    const where = {};
    if (bloodGroup) where.bloodGroup = bloodGroup;
    if (locality) where.locality = { contains: locality, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (urgency) where.urgency = urgency;
    if (status) where.status = status;
    else where.status = { not: 'CANCELLED' };

    let orderBy = [];
    if (sort === 'newest') orderBy = [{ createdAt: 'desc' }];
    else if (sort === 'oldest') orderBy = [{ createdAt: 'asc' }];
    else if (sort === 'urgent') {
      orderBy = [
        { urgency: 'asc' }, // CRITICAL < URGENT < PLANNED alphabetically won't work, use raw
        { createdAt: 'desc' },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sos, total] = await Promise.all([
      prisma.sOSRequest.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          requester: {
            select: { id: true, fullName: true },
          },
          _count: { select: { contactLogs: true } },
        },
      }),
      prisma.sOSRequest.count({ where }),
    ]);

    // Sort CRITICAL first if sort=urgent
    let result = sos;
    if (sort === 'urgent') {
      const urgencyOrder = { CRITICAL: 0, URGENT: 1, PLANNED: 2 };
      result = sos.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
    }

    return sendSuccess(res, {
      sos: result,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('GetSOS error:', error);
    return sendError(res, 'Failed to retrieve SOS requests.', 500);
  }
};

/**
 * GET /api/sos/:id
 */
const getSOSById = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.findUnique({
      where: { id: req.params.id },
      include: {
        requester: { select: { id: true, fullName: true, phone: true } },
        contactLogs: {
          include: {
            donor: { include: { user: { select: { fullName: true } } } },
            user: { select: { fullName: true } },
          },
          orderBy: { contactedAt: 'desc' },
        },
        _count: { select: { contactLogs: true } },
      },
    });
    if (!sos) return sendError(res, 'SOS request not found.', 404);
    return sendSuccess(res, { sos });
  } catch (error) {
    console.error('GetSOSById error:', error);
    return sendError(res, 'Failed to retrieve SOS request.', 500);
  }
};

/**
 * PUT /api/sos/:id
 */
const updateSOS = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.findUnique({ where: { id: req.params.id } });
    if (!sos) return sendError(res, 'SOS request not found.', 404);

    if (sos.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
      return sendError(res, 'You are not authorized to update this SOS request.', 403);
    }

    const { bloodGroup, unitsRequired, hospitalName, hospitalAddress, locality, city, urgency, contactNumber, message } = req.body;

    const updated = await prisma.sOSRequest.update({
      where: { id: req.params.id },
      data: {
        ...(bloodGroup && { bloodGroup }),
        ...(unitsRequired && { unitsRequired: parseInt(unitsRequired) }),
        ...(hospitalName && { hospitalName }),
        ...(hospitalAddress && { hospitalAddress }),
        ...(locality && { locality }),
        ...(city && { city }),
        ...(urgency && { urgency }),
        ...(contactNumber && { contactNumber }),
        ...(message !== undefined && { message }),
      },
    });

    return sendSuccess(res, { sos: updated }, 'SOS request updated.');
  } catch (error) {
    console.error('UpdateSOS error:', error);
    return sendError(res, 'Failed to update SOS request.', 500);
  }
};

/**
 * PUT /api/sos/:id/fulfill
 */
const fulfillSOS = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.findUnique({ where: { id: req.params.id } });
    if (!sos) return sendError(res, 'SOS request not found.', 404);

    if (sos.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
      return sendError(res, 'You are not authorized to fulfill this SOS request.', 403);
    }

    const updated = await prisma.sOSRequest.update({
      where: { id: req.params.id },
      data: { status: 'FULFILLED' },
    });

    return sendSuccess(res, { sos: updated }, 'SOS request marked as fulfilled. Thank you!');
  } catch (error) {
    console.error('FulfillSOS error:', error);
    return sendError(res, 'Failed to fulfill SOS request.', 500);
  }
};

/**
 * PUT /api/sos/:id/close
 */
const closeSOS = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.findUnique({ where: { id: req.params.id } });
    if (!sos) return sendError(res, 'SOS request not found.', 404);

    if (sos.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
      return sendError(res, 'You are not authorized to close this SOS request.', 403);
    }

    const updated = await prisma.sOSRequest.update({
      where: { id: req.params.id },
      data: { status: 'CLOSED' },
    });

    return sendSuccess(res, { sos: updated }, 'SOS request closed.');
  } catch (error) {
    console.error('CloseSOS error:', error);
    return sendError(res, 'Failed to close SOS request.', 500);
  }
};

/**
 * DELETE /api/sos/:id
 */
const deleteSOS = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.findUnique({ where: { id: req.params.id } });
    if (!sos) return sendError(res, 'SOS request not found.', 404);

    if (sos.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
      return sendError(res, 'You are not authorized to delete this SOS request.', 403);
    }

    await prisma.sOSRequest.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    return sendSuccess(res, {}, 'SOS request cancelled.');
  } catch (error) {
    console.error('DeleteSOS error:', error);
    return sendError(res, 'Failed to cancel SOS request.', 500);
  }
};

/**
 * GET /api/sos/my
 * Get current user's SOS requests
 */
const getMySOS = async (req, res) => {
  try {
    const sos = await prisma.sOSRequest.findMany({
      where: { requesterId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { contactLogs: true } },
      },
    });
    return sendSuccess(res, { sos });
  } catch (error) {
    console.error('GetMySOS error:', error);
    return sendError(res, 'Failed to retrieve your SOS requests.', 500);
  }
};

module.exports = {
  createSOS, getSOSRequests, getSOSById, updateSOS,
  fulfillSOS, closeSOS, deleteSOS, getMySOS,
};
