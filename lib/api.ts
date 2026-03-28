import { 
  EventType, 
  Availability, 
  MeetingWithEventType, 
  TimeSlot, 
  EventTypeWithUser,
  Meeting
} from "../types";
import { EventTypeInput, AvailabilityInput, BookingInput } from "./validations";

const API_BASE = "http://localhost:3001/api";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Unknown API error");
  }
  return json.data as T;
}

// --- EVENT TYPES ---
export async function fetchEventTypes(): Promise<EventType[]> {
  return fetcher<EventType[]>(`\${API_BASE}/event-types`);
}

export async function createEventType(data: EventTypeInput): Promise<EventType> {
  return fetcher<EventType>(`\${API_BASE}/event-types`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEventType({ id, data }: { id: string; data: Partial<EventTypeInput> }): Promise<EventType> {
  return fetcher<EventType>(`\${API_BASE}/event-types/\${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEventType(id: string): Promise<null> {
  return fetcher<null>(`\${API_BASE}/event-types/\${id}`, {
    method: "DELETE",
  });
}

// --- AVAILABILITY ---
export async function fetchAvailability(): Promise<Availability[]> {
  return fetcher<Availability[]>(`\${API_BASE}/availability`);
}

export async function updateAvailability(data: AvailabilityInput["availability"]): Promise<Availability[]> {
  return fetcher<Availability[]>(`\${API_BASE}/availability`, {
    method: "PUT",
    body: JSON.stringify({ availability: data }),
  });
}

// --- MEETINGS (HOST) ---
export async function fetchMeetings(): Promise<MeetingWithEventType[]> {
  return fetcher<MeetingWithEventType[]>(`\${API_BASE}/meetings`);
}

export async function cancelMeeting(id: string): Promise<Meeting> {
  return fetcher<Meeting>(`\${API_BASE}/meetings/\${id}/cancel`, {
    method: "PATCH",
  });
}

// --- PUBLIC BOOKING ---
export async function fetchPublicEvent(slug: string): Promise<EventTypeWithUser> {
  return fetcher<EventTypeWithUser>(`\${API_BASE}/public/event/\${slug}`);
}

export async function fetchPublicSlots(slug: string, dateStr: string): Promise<TimeSlot[]> {
  return fetcher<TimeSlot[]>(`\${API_BASE}/public/slots/\${slug}?date=\${dateStr}`);
}

export async function bookPublicMeeting({ slug, data }: { slug: string; data: BookingInput }): Promise<Meeting> {
  return fetcher<Meeting>(`\${API_BASE}/public/book/\${slug}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
