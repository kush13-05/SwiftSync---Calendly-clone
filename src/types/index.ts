// Define MeetingStatus locally so this file works in both frontend and backend contexts
export type MeetingStatus = "SCHEDULED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
  createdAt: Date;
}

export interface EventType {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  color: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Meeting {
  id: string;
  eventTypeId: string;
  inviteeName: string;
  inviteeEmail: string;
  inviteeNotes: string | null;
  startTime: Date;
  endTime: Date;
  status: MeetingStatus;
  createdAt: Date;
}

// Complex aggregate types used on the frontend
export interface EventTypeWithUser extends EventType {
  user: Pick<User, "name" | "timezone">;
}

export interface MeetingWithEventType extends Meeting {
  eventType: Pick<EventType, "name" | "color" | "duration">;
}

// Slot returned from the API slot generation endpoint
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  label: string; // "9:00 AM"
}

// Universal API Response Contract
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
