const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SWIFTSYNC MASTER SEED ---');
  
  // 1. Master User
  const user = await prisma.user.upsert({
    where: { email: 'hello@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'hello@example.com',
      timezone: 'UTC'
    }
  });
  console.log(`Master User: ${user.name} (${user.id})`);

  // 2. Clear stale data (Safety check)
  await prisma.meeting.deleteMany({});
  await prisma.eventType.deleteMany({});
  
  // 3. 3x Standard Event Types
  const standardEvents = [
    { name: '15 Min Meeting', slug: '15-min', duration: 15, color: '#006BFF', userId: user.id },
    { name: '30 Min Meeting', slug: '30-min', duration: 30, color: '#10B981', userId: user.id },
    { name: '60 Min Meeting', slug: '60-min', duration: 60, color: '#F59E0B', userId: user.id }
  ];

  for (const et of standardEvents) {
    await prisma.eventType.create({ data: et });
  }
  console.log('Created 3 standard event types linked to Master User');

  // 4. Availability
  const availCount = await prisma.availability.count({ where: { userId: user.id } });
  if (availCount === 0) {
    const batch = [];
    for (let i = 1; i <= 5; i++) {
      batch.push({ userId: user.id, dayOfWeek: i, startTime: '09:00', endTime: '17:00', isActive: true });
    }
    await prisma.availability.createMany({ data: batch });
    console.log('Initialized default availability');
  }

  console.log('--- MASTER SEED COMPLETE ---');
}

main().finally(async () => { await prisma.$disconnect(); });
