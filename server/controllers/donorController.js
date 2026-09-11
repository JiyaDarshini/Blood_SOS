const prisma = require('../config/database');
const { getCompatibleDonors } = require('../utils/bloodCompatibility');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/donors
 * Get all donors with optional filters
 */
const getDonors = async (req, res) => {
  try {
    const { bloodGroup, locality, city, pincode, isAvailable, page = 1, limit = 20 } = req.query;

    const where = {};
    if (bloodGroup) where.bloodGroup = bloodGroup;
    if (locality) where.locality = { contains: locality, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (pincode) where.pincode = pincode;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [{ isAvailable: 'desc' }, { updatedAt: 'desc' }],
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              // Phone only exposed to authenticated users (handled in route)
            },
          },
        },
      }),
      prisma.donor.count({ where }),
    ]);

    // If user is authenticated, include phone; otherwise mask it
    const isAuthenticated = !!req.user;
    const sanitizedDonors = donors.map((donor) => ({
      ...donor,
      user: {
        id: donor.user.id,
        fullName: donor.user.fullName,
        phone: isAuthenticated ? donor.user.phone : null,
      },
    }));

    return sendSuccess(res, {
      donors: sanitizedDonors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('GetDonors error:', error);
    return sendError(res, 'Failed to retrieve donors.', 500);
  }
};

/**
 * GET /api/donors/:id
 */
const getDonorById = async (req, res) => {
  try {
    const donor = await prisma.donor.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
      },
    });
    if (!donor) return sendError(res, 'Donor not found.', 404);
    return sendSuccess(res, { donor });
  } catch (error) {
    console.error('GetDonorById error:', error);
    return sendError(res, 'Failed to retrieve donor.', 500);
  }
};

/**
 * PUT /api/donors/availability
 * Toggle donor availability
 */
const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const donor = await prisma.donor.findUnique({ where: { userId: req.user.id } });
    if (!donor) {
      return sendError(res, 'Donor profile not found. Please complete your donor registration.', 404);
    }

    const updated = await prisma.donor.update({
      where: { userId: req.user.id },
      data: { isAvailable: Boolean(isAvailable) },
    });

    return sendSuccess(
      res,
      { donor: updated },
      `Availability updated. You are now ${updated.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'} for donation.`
    );
  } catch (error) {
    console.error('UpdateAvailability error:', error);
    return sendError(res, 'Failed to update availability.', 500);
  }
};

/**
 * GET /api/donors/match/:bloodGroup
 * Get compatible donors for a blood group, prioritized by locality
 */
const getMatchingDonors = async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    const { locality, city } = req.query;

    const compatibleGroups = getCompatibleDonors(bloodGroup);

    const donors = await prisma.donor.findMany({
      where: {
        bloodGroup: { in: compatibleGroups },
        isAvailable: true,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    // Sort: same locality > same city > others
    const sorted = donors.sort((a, b) => {
      const aLocScore =
        locality && a.locality.toLowerCase().includes(locality.toLowerCase())
          ? 2
          : city && a.city.toLowerCase().includes(city.toLowerCase())
          ? 1
          : 0;
      const bLocScore =
        locality && b.locality.toLowerCase().includes(locality.toLowerCase())
          ? 2
          : city && b.city.toLowerCase().includes(city.toLowerCase())
          ? 1
          : 0;
      return bLocScore - aLocScore;
    });

    return sendSuccess(res, {
      count: sorted.length,
      donors: sorted,
      compatibleGroups,
    }, `Found ${sorted.length} compatible donor(s).`);
  } catch (error) {
    console.error('GetMatchingDonors error:', error);
    return sendError(res, 'Failed to find matching donors.', 500);
  }
};

/**
 * POST /api/donors/register
 * Register as a donor (for existing users)
 */
const registerDonor = async (req, res) => {
  try {
    const { bloodGroup, locality, city, pincode } = req.body;

    const existing = await prisma.donor.findUnique({ where: { userId: req.user.id } });
    if (existing) {
      return sendError(res, 'You already have a donor profile.', 409);
    }

    const donor = await prisma.donor.create({
      data: {
        userId: req.user.id,
        bloodGroup,
        locality,
        city,
        pincode,
        isAvailable: true,
      },
    });

    // Update user role to include DONOR
    if (req.user.role === 'REQUESTER') {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { role: 'BOTH' },
      });
    }

    return sendSuccess(res, { donor }, 'Donor profile created successfully.', 201);
  } catch (error) {
    console.error('RegisterDonor error:', error);
    return sendError(res, 'Failed to create donor profile.', 500);
  }
};

module.exports = { getDonors, getDonorById, updateAvailability, getMatchingDonors, registerDonor };
