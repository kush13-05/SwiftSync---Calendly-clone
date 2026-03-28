// Re-export from src/types so both server and frontend share the same shape
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

export interface EventTypeWithUser extends EventType {
  user: Pick<User, "name" | "timezone">;
}

export interface MeetingWithEventType extends Meeting {
  eventType: Pick<EventType, "name" | "color" | "duration">;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  label: string;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
