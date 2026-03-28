import prisma from "../prisma";
import { AvailabilityInput } from "../../lib/validations";

async function getActiveUserId(): Promise<string> {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No active user available in the system.");
  return user.id;
}

export async function getAll(userId: string) {
  const resolvedUserId = await getActiveUserId();
  
  return prisma.availability.findMany({
    where: { userId: resolvedUserId },
    orderBy: { dayOfWeek: "asc" }
  });
}

// Drops old availability ranges and reconstructs new ones to prevent overlapping merge issues
export async function bulkUpdate(userId: string, availabilityData: AvailabilityInput["availability"]) {
  const resolvedUserId = await getActiveUserId();
  
  // We use a transaction to ensure all availability drops/re-adds happen atomically
  return prisma.$transaction(async (tx) => {
    // 1. Clear out user's existing availability rules entirely
    await tx.availability.deleteMany({
      where: { userId: resolvedUserId }
    });

    // 2. Re-create new ones with user explicitly bound to them
    const creationData = availabilityData.map(record => ({
      userId: resolvedUserId,
      dayOfWeek: record.dayOfWeek,
      startTime: record.startTime,
      endTime: record.endTime,
      isActive: record.isActive
    }));

    await tx.availability.createMany({
      data: creationData
    });

    // 3. Return the new fresh dataset
    return tx.availability.findMany({
      where: { userId: resolvedUserId },
      orderBy: { dayOfWeek: "asc" }
    });
  });
}
