const { PrismaClient } = require('@prisma/client');
const bcrypt = require('../server/node_modules/bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const adminHashedPassword = await bcrypt.hash('AdminPassword123!', 10);

  // 1. Seed Localities
  console.log('Clearing existing data...');
  await prisma.contactLog.deleteMany({});
  await prisma.sOSRequest.deleteMany({});
  await prisma.donor.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.locality.deleteMany({});

  console.log('Seeding Localities...');
  const localities = await Promise.all([
    prisma.locality.create({ data: { name: 'Indiranagar', city: 'Bengaluru', pincode: '560038' } }),
    prisma.locality.create({ data: { name: 'Koramangala', city: 'Bengaluru', pincode: '560034' } }),
    prisma.locality.create({ data: { name: 'HSR Layout', city: 'Bengaluru', pincode: '560102' } }),
    prisma.locality.create({ data: { name: 'Whitefield', city: 'Bengaluru', pincode: '560066' } }),
    prisma.locality.create({ data: { name: 'Jayanagar', city: 'Bengaluru', pincode: '560011' } }),
    prisma.locality.create({ data: { name: 'MG Road', city: 'Bengaluru', pincode: '560001' } }),
  ]);

  // 2. Seed Admin
  console.log('Seeding Admin User...');
  const admin = await prisma.user.create({
    data: {
      fullName: 'System Administrator',
      email: 'admin@bloodsos.com',
      phone: '+919876543210',
      passwordHash: adminHashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // 3. Seed Donors & Users
  console.log('Seeding Donors...');
  const donorsData = [
    { name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+919123456781', group: 'O_POS', loc: 'Indiranagar', pin: '560038', avail: true, role: 'DONOR' },
    { name: 'Priya Patel', email: 'priya.p@example.com', phone: '+919123456782', group: 'A_POS', loc: 'Koramangala', pin: '560034', avail: true, role: 'DONOR' },
    { name: 'Amit Verma', email: 'amit.v@example.com', phone: '+919123456783', group: 'B_POS', loc: 'HSR Layout', pin: '560102', avail: false, role: 'DONOR' },
    { name: 'Sneha Rao', email: 'sneha.r@example.com', phone: '+919123456784', group: 'O_NEG', loc: 'Indiranagar', pin: '560038', avail: true, role: 'BOTH' },
    { name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+919123456785', group: 'AB_POS', loc: 'Whitefield', pin: '560066', avail: true, role: 'DONOR' },
    { name: 'Ananya Roy', email: 'ananya.r@example.com', phone: '+919123456786', group: 'A_NEG', loc: 'Jayanagar', pin: '560011', avail: true, role: 'DONOR' },
    { name: 'Karthik N', email: 'karthik.n@example.com', phone: '+919123456787', group: 'B_NEG', loc: 'Koramangala', pin: '560034', avail: true, role: 'DONOR' },
  ];

  const createdDonors = [];
  for (const d of donorsData) {
    const user = await prisma.user.create({
      data: {
        fullName: d.name,
        email: d.email,
        phone: d.phone,
        passwordHash: hashedPassword,
        role: d.role,
        status: 'ACTIVE',
        donor: {
          create: {
            bloodGroup: d.group,
            locality: d.loc,
            city: 'Bengaluru',
            pincode: d.pin,
            isAvailable: d.avail,
          },
        },
      },
      include: { donor: true },
    });
    createdDonors.push(user);
  }

  // 4. Seed Requesters
  console.log('Seeding Requesters...');
  const requester = await prisma.user.create({
    data: {
      fullName: 'Deepak Kumar',
      email: 'deepak@example.com',
      phone: '+919988776655',
      passwordHash: hashedPassword,
      role: 'REQUESTER',
      status: 'ACTIVE',
    },
  });

  // 5. Seed SOS Requests
  console.log('Seeding SOS Requests...');
  const sos1 = await prisma.sOSRequest.create({
    data: {
      requesterId: requester.id,
      bloodGroup: 'O_POS',
      unitsRequired: 2,
      hospitalName: 'Manipal Hospital',
      hospitalAddress: '98 HAL Old Airport Road, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      urgency: 'CRITICAL',
      contactNumber: '+919988776655',
      message: 'Urgent requirement for heart surgery. Please help!',
      status: 'ACTIVE',
    },
  });

  const sos2 = await prisma.sOSRequest.create({
    data: {
      requesterId: createdDonors[3].id, // Sneha (BOTH)
      bloodGroup: 'A_POS',
      unitsRequired: 1,
      hospitalName: 'Apollo Hospital',
      hospitalAddress: '154/11 Bannerghatta Road',
      locality: 'Koramangala',
      city: 'Bengaluru',
      urgency: 'URGENT',
      contactNumber: '+919123456784',
      message: 'Platelet transfusion needed by evening.',
      status: 'ACTIVE',
    },
  });

  const sos3 = await prisma.sOSRequest.create({
    data: {
      requesterId: requester.id,
      bloodGroup: 'B_POS',
      unitsRequired: 3,
      hospitalName: 'Fortis Hospital',
      hospitalAddress: '154/9 Bannerghatta Road',
      locality: 'HSR Layout',
      city: 'Bengaluru',
      urgency: 'PLANNED',
      contactNumber: '+919988776655',
      message: 'Scheduled surgery on Monday.',
      status: 'FULFILLED',
    },
  });

  // 6. Seed Contact Logs
  console.log('Seeding Contact Logs...');
  await prisma.contactLog.create({
    data: {
      sosId: sos1.id,
      donorId: createdDonors[0].donor.id, // Rahul (O_POS)
      userId: requester.id,
      channel: 'CALL',
    },
  });

  await prisma.contactLog.create({
    data: {
      sosId: sos1.id,
      donorId: createdDonors[0].donor.id,
      userId: requester.id,
      channel: 'WHATSAPP',
    },
  });

  console.log('✅ Database successfully seeded!');
  console.log('\n--- DEMO ACCOUNTS ---');
  console.log('Admin Account:   email: admin@bloodsos.com | password: AdminPassword123!');
  console.log('User Account:    email: rahul.s@example.com | password: Password123!');
  console.log('Requester Acc:   email: deepak@example.com | password: Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
