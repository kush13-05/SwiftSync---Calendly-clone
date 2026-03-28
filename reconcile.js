const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SWIFTSYNC DATA RECONCILIATION ---');
  
  // 1. Resolve the MASTER demo user
  let user = await prisma.user.findUnique({ where: { email: 'hello@example.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'hello@example.com',
        timezone: 'UTC'
      }
    });
    console.log('Created fresh Demo User');
  }
  
  console.log(`Master User ID: ${user.id}`);

  // 2. Re-link all EventTypes to this User
  const etUpdate = await prisma.eventType.updateMany({
    data: { userId: user.id }
  });
  console.log(`Re-linked ${etUpdate.count} EventTypes to Master User`);

  // 3. Availability Check
  const availCount = await prisma.availability.count({ where: { userId: user.id } });
  if (availCount === 0) {
    // Basic Mon-Fri 9-5 fallback if empty
    const batch = [];
    for (let i = 1; i <= 5; i++) {
      batch.push({ userId: user.id, dayOfWeek: i, startTime: '09:00', endTime: '17:00', isActive: true });
    }
    await prisma.availability.createMany({ data: batch });
    console.log('Initialized default availability');
  }

  console.log('--- RECONCILIATION COMPLETE ---');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
