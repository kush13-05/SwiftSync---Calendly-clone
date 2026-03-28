import { z } from "zod";

export const eventTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  duration: z.number().int().min(15).max(480),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Valid hex color required"),
  isActive: z.boolean().default(true),
});

export type EventTypeInput = z.infer<typeof eventTypeSchema>;

export const availabilitySchema = z.object({
  availability: z.array(z.object({
    id: z.string().uuid().optional(),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
    isActive: z.boolean()
  }))
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

export const bookingSchema = z.object({
  inviteeName: z.string().min(1, "Name is required").max(100),
  inviteeEmail: z.string().email("Valid email required"),
  inviteeNotes: z.string().max(500).optional(),
  startTime: z.string().datetime(), // ISO string from frontend
  endTime: z.string().datetime(),
  timezone: z.string() // So backend knows what they booked in
});

export type BookingInput = z.infer<typeof bookingSchema>;
