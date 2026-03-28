import prisma from "../prisma";
import { EventTypeInput } from "../../lib/validations";

// Helper function to resolve our single demo user reliably
async function getActiveUserId(): Promise<string> {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No active user available in the system.");
  return user.id;
}

export async function getAll(userId: string) {
  const resolvedUserId = await getActiveUserId();
  // Service directly calls the ORM and only deals with pure DB logic
  return prisma.eventType.findMany({
    where: { userId: resolvedUserId },
    orderBy: { createdAt: "desc" }
  });
}

export async function create(userId: string, data: EventTypeInput) {
  const resolvedUserId = await getActiveUserId();
  
  // Enforce slug uniqueness check natively inside service
  const existingSlug = await prisma.eventType.findUnique({
    where: { slug: data.slug }
  });
  
  if (existingSlug) {
    throw new Error(`The slug "\${data.slug}" is already taken.`);
  }

  return prisma.eventType.create({
    data: {
      ...data,
      userId: resolvedUserId,
    }
  });
}

export async function update(id: string, userId: string, data: Partial<EventTypeInput>) {
  const resolvedUserId = await getActiveUserId();
  
  // Guard clause against unauthorized modifications
  const existingEvent = await prisma.eventType.findUnique({ where: { id } });
  if (!existingEvent || existingEvent.userId !== resolvedUserId) {
    throw new Error("EventType not found or unauthorized");
  }

  return prisma.eventType.update({
    where: { id },
    data,
  });
}

export async function remove(id: string, userId: string) {
  const resolvedUserId = await getActiveUserId();
  
  // We use Prisma's strict cascading to auto-delete associated meetings if needed
  const existingEvent = await prisma.eventType.findUnique({ where: { id } });
  if (!existingEvent || existingEvent.userId !== resolvedUserId) {
    throw new Error("EventType not found or unauthorized");
  }

  return prisma.eventType.delete({
    where: { id }
  });
}
