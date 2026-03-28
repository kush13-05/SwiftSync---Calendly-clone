import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPublicEvent, fetchPublicSlots, bookPublicMeeting } from "../lib/api";
import { BookingInput } from "../lib/validations";

// Fetches the event details for the left hand side of the booking screen
export function usePublicEvent(slug: string) {
  return useQuery({
    queryKey: ["publicEvent", slug],
    queryFn: () => fetchPublicEvent(slug),
    enabled: !!slug,
  });
}

// Fetches available timeslots for a specific clicked day
export function usePublicSlots(slug: string, dateStr: string | null) {
  return useQuery({
    queryKey: ["publicSlots", slug, dateStr],
    queryFn: () => fetchPublicSlots(slug, dateStr as string),
    enabled: !!slug && !!dateStr,
  });
}

// Submits the final booking form returning the new meeting details
export function useBookMeeting(slug: string) {
  return useMutation({
    mutationFn: (data: BookingInput) => bookPublicMeeting({ slug, data }),
  });
}
