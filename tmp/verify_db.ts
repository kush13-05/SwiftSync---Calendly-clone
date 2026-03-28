import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const latestMeeting = await prisma.meeting.findFirst({
    orderBy: { createdAt: "desc" },
    include: { eventType: true },
  });

  if (latestMeeting) {
    console.log("---------------------------------------");
    console.log("DATABASE VERIFICATION: RECORD FOUND");
    console.log("---------------------------------------");
    console.log(`Invitee: ${latestMeeting.inviteeName}`);
    console.log(`Email:   ${latestMeeting.inviteeEmail}`);
    console.log(`Event:   ${latestMeeting.eventType.name}`);
    console.log(`Time:    ${latestMeeting.startTime}`);
    console.log(`Status:  ${latestMeeting.status}`);
    console.log("---------------------------------------");
  } else {
    console.log("No meetings found in the database.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
