import prisma from "../prisma";

/**
 * For this demo/clone, we assume a single "Demo User" context.
 * This ensures that every part of the app points to the same host identity.
 */
export async function getDemoUser() {
  // We ALWAYS look for the user with this specific email to ensure consistency
  // across seeds and manual bookings.
  let user = await prisma.user.findUnique({
    where: { email: "hello@example.com" },
  });

  // If the user doesn't exist (e.g., after a manual DB wipe), we re-create it
  // on the fly to prevent crashes and ensure data-linkage.
  if (!user) {
    user = await prisma.user.upsert({
      where: { email: "hello@example.com" },
      update: {},
      create: {
        name: "Demo User",
        email: "hello@example.com",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      },
    });
  }

  return user;
}
