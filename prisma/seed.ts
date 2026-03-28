import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

// Standard PrismaClient using environment variables for local synchronization
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Resolve or create user demo identity
  const user = await prisma.user.upsert({
    where: { email: 'hello@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'hello@example.com',
      timezone: 'America/New_York',
    },
  })
  console.log(`Resolved user identity: \${user.id}`)

  // 2. Refresh data for a clean demonstration state
  await prisma.meeting.deleteMany({})
  await prisma.availability.deleteMany({})
  await prisma.eventType.deleteMany({})

  // 3. Create core event types
  const eventTypes = [
    { name: '15 Min Meeting', slug: '15-min', duration: 15, color: '#006BFF', userId: user.id },
    { name: '30 Min Meeting', slug: '30-min', duration: 30, color: '#10B981', userId: user.id },
    { name: '60 Min Meeting', slug: '60-min', duration: 60, color: '#F59E0B', userId: user.id }
  ]

  for (const et of eventTypes) {
    await prisma.eventType.create({ data: et })
  }
  console.log('Created 3 standard event types')

  // 4. Populate Mon-Fri 9-5 availability rules
  const availability = []
  for (let day = 1; day <= 5; day++) {
    availability.push({
      userId: user.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      isActive: true,
    })
  }
  await prisma.availability.createMany({ data: availability })
  console.log('Synchronized Mon-Fri availability rules')

  // 5. Populate demo meetings for the dashboard
  const events = await prisma.eventType.findMany()
  const firstEvent = events[0]
  const now = new Date()

  const schedules = [
    { name: 'Alice (Future)', offset: 1, hour: 10 },
    { name: 'Bob (Future)', offset: 2, hour: 14 },
    { name: 'Charlie (Past)', offset: -1, hour: 11 },
    { name: 'Dave (Past)', offset: -2, hour: 15 }
  ]

  for (const s of schedules) {
    const start = new Date(now)
    start.setDate(now.getDate() + s.offset)
    start.setHours(s.hour, 0, 0, 0)
    
    await prisma.meeting.create({
      data: {
        eventTypeId: firstEvent.id,
        inviteeName: s.name,
        inviteeEmail: s.name.toLowerCase().split(' ')[0] + '@example.com',
        startTime: start,
        endTime: new Date(start.getTime() + firstEvent.duration * 60000),
        status: 'SCHEDULED'
      }
    })
  }
  console.log('Finalized seeding of 4 demo meetings')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Database synchronization complete.')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
