import prisma from "../prisma";
import { BookingInput } from "../../lib/validations";
import { format } from "date-fns";

export async function getAll(userId: string) {
  // Pull all meetings where the parent EventType belongs to the user
  return prisma.meeting.findMany({
    where: { 
      eventType: { userId: userId } 
    },
    include: {
      eventType: {
        select: {
          name: true,
          color: true,
          duration: true,
        }
      }
    },
    orderBy: { startTime: "asc" }
  });
}

export async function create(eventTypeId: string, data: BookingInput) {
  const meeting = await prisma.meeting.create({
    data: {
      eventTypeId: eventTypeId,
      inviteeName: data.inviteeName,
      inviteeEmail: data.inviteeEmail,
      inviteeNotes: data.inviteeNotes,
      startTime: processISOString(data.startTime),
      endTime: processISOString(data.endTime),
      status: "SCHEDULED"
    },
    include: { eventType: true }
  });

  // SIMULATED EMAIL CONFIRMATION
  mockSendEmail(meeting);

  return meeting;
}

export async function cancel(userId: string, meetingId: string) {
  // Ensure meeting exists and belongs to the host user
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { eventType: true }
  });

  if (!meeting || meeting.eventType.userId !== userId) {
    throw new Error("Meeting not found or unauthorized");
  }

  const cancelled = await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: "CANCELLED" }
  });

  // SIMULATED CANCELLATION EMAIL
  console.log(`\n[SwiftSync EMAIL SIMULATION]`);
  console.log(`To: ${meeting.inviteeEmail}`);
  console.log(`Subject: Meeting Cancelled: ${meeting.eventType.name}`);
  console.log(`Body: Your meeting on ${format(new Date(meeting.startTime), "PPP")} has been cancelled.\n`);

  return cancelled;
}

/**
 * Mock function to simulate an email service like SendGrid or Resend.
 * Prints a professional confirmation message to the server console.
 */
function mockSendEmail(meeting: any) {
  const dateStr = format(new Date(meeting.startTime), "PPPP");
  const timeStr = format(new Date(meeting.startTime), "p");

  console.log(`\n--------------------------------------------`);
  console.log(`[SwiftSync EMAIL SIMULATION - CONFIRMATION]`);
  console.log(`--------------------------------------------`);
  console.log(`To: ${meeting.inviteeEmail}`);
  console.log(`Subject: Confirmed: ${meeting.eventType.name} with Demo User`);
  console.log(`\nHi ${meeting.inviteeName},`);
  console.log(`Your meeting is confirmed!`);
  console.log(`\nEvent: ${meeting.eventType.name}`);
  console.log(`Date: ${dateStr}`);
  console.log(`Time: ${timeStr}`);
  console.log(`\nLocation: SwiftSync Video Call`);
  console.log(`\nLooking forward to seeing you!`);
  console.log(`--------------------------------------------\n`);
}

// Ensure JS constructs a true UTC Date explicitly
function processISOString(isoString: string): Date {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid datetime string format.");
  }
  return date;
}
