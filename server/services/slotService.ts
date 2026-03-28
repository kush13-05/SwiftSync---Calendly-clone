import prisma from "../prisma";
import { format, parse, addMinutes, isAfter, isSameDay, parseISO, startOfDay, endOfDay } from "date-fns";
import { TimeSlot } from "../../types";

export async function getAvailableTimeSlots(
  userId: string,
  eventTypeId: string,
  durationInMinutes: number,
  targetDateString: string // e.g. "2023-10-25"
): Promise<TimeSlot[]> {
  const targetDate = parseISO(targetDateString);
  const dayOfWeekIndex = targetDate.getDay(); // 0 is Sunday

  // Step 1: Get availability for that day of week
  const availabilityRules = await fetchAvailabilityForDay(userId, dayOfWeekIndex);
  
  if (availabilityRules.length === 0) {
    return []; // No rules defined = completely unavailable
  }

  // Step 2: Build all possible slots (start + duration = next slot)
  const allPossibleSlots = buildAllPossibleSlots(targetDate, availabilityRules, durationInMinutes);

  // Step 3: Fetch already booked meetings for that date
  const bookedMeetings = await fetchBookedMeetings(userId, targetDate);

  // Step 4: Remove booked slots from possible slots
  const slotsWithoutConflicts = removeBookedSlots(allPossibleSlots, bookedMeetings, durationInMinutes);

  // Step 5: Remove past slots (if today)
  const cleanFutureSlots = removePastSlots(slotsWithoutConflicts);

  // Step 6: Return clean array
  return cleanFutureSlots;
}

// Ensure the helper only extracts active rules for this specific day numeral
async function fetchAvailabilityForDay(userId: string, dayOfWeekIndex: number) {
  return prisma.availability.findMany({
    where: { 
      userId, 
      dayOfWeek: dayOfWeekIndex,
      isActive: true 
    }
  });
}

function buildAllPossibleSlots(
  targetDate: Date, 
  availabilityRules: Array<{ startTime: string; endTime: string }>,
  duration: number
): TimeSlot[] {
  const possibleSlots: TimeSlot[] = [];

  for (const rule of availabilityRules) {
    // Both '13:00' strings translate to correct temporal points on this Date
    let currentSlotStart = parse(rule.startTime, "HH:mm", targetDate);
    const ruleEndLimits = parse(rule.endTime, "HH:mm", targetDate);

    // Keep advancing by duration until the requested end time bleeds past the configured rule end
    while (true) {
      const currentSlotEnd = addMinutes(currentSlotStart, duration);
      
      // If ending time of this chunk violates the bounds, stop creating slots
      if (isAfter(currentSlotEnd, ruleEndLimits)) {
        break;
      }

      possibleSlots.push({
        startTime: currentSlotStart,
        endTime: currentSlotEnd,
        label: format(currentSlotStart, "h:mm a") // e.g. "9:00 AM"
      });

      currentSlotStart = currentSlotEnd; 
    }
  }

  return possibleSlots;
}

async function fetchBookedMeetings(userId: string, targetDate: Date) {
  // Broadly capture any scheduled meeting intersecting this day
  return prisma.meeting.findMany({
    where: {
      eventType: { userId },
      status: "SCHEDULED",
      startTime: {
        gte: startOfDay(targetDate), // 00:00:00
        lt: endOfDay(targetDate)     // 23:59:59
      }
    }
  });
}

function removeBookedSlots(
  allSlots: TimeSlot[], 
  bookedMeetings: Array<{ startTime: Date; endTime: Date }>,
  duration: number
): TimeSlot[] {
  // Remove any slot that collides heavily with a confirmed meeting
  const availableSlots = allSlots.filter((slot) => {
    // If the proposed slot's start time explicitly sits anywhere inside a booked block
    const isOverlapping = bookedMeetings.some((meeting) => {
       // Collision conditions for two intervals A and B overlapping:
       // StartA < EndB AND StartB < EndA
       const slotStartsBeforeMeetingEnds = slot.startTime < meeting.endTime;
       const meetingStartsBeforeSlotEnds = meeting.startTime < slot.endTime;
       return slotStartsBeforeMeetingEnds && meetingStartsBeforeSlotEnds;
    });
    
    return !isOverlapping;
  });

  return availableSlots;
}

function removePastSlots(slots: TimeSlot[]): TimeSlot[] {
  const now = new Date();
  
  // Filter out times falling rigidly before the exact present millisecond
  return slots.filter((slot) => {
    return isAfter(slot.startTime, now);
  });
}
