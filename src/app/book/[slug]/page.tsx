"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePublicEvent, usePublicSlots, useBookMeeting } from "../../../hooks/usePublicBooking";
import { CalendarPicker } from "../../../components/features/booking/CalendarPicker";
import { TimeSlotGrid } from "../../../components/features/booking/TimeSlotGrid";
import { BookingForm } from "../../../components/features/booking/BookingForm";
import { format } from "date-fns";
import { Clock, Globe, ArrowLeft } from "lucide-react";
import { TimeSlot } from "../../../types";
import { BookingInput } from "../../../lib/validations";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: eventType, isLoading: isEventLoading, isError: isEventError } = usePublicEvent(slug);

  // Formats the selected date to YYYY-MM-DD for the API query
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const { data: slots, isLoading: isSlotsLoading } = usePublicSlots(slug, selectedDateStr);

  const { mutate: book, isPending: isBooking } = useBookMeeting(slug);

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowForm(false);
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
    setShowForm(true);
  }

  function handleBookingSubmit(data: BookingInput) {
    book(data, {
      onSuccess: (meeting) => {
        router.push(`/book/${slug}/confirmed?meetingId=${meeting.id}`);
      },
    });
  }

  if (isEventLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#6B7280]">Loading...</div>;
  }

  if (isEventError || !eventType) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-start justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col lg:flex-row overflow-hidden max-w-4xl w-full">

        {/* LEFT PANEL — event info */}
        <div className="w-full lg:w-72 p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-white">
          <div
            className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
            style={{ backgroundColor: eventType.color + "20" }}
          >
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: eventType.color }} />
          </div>

          <p className="text-[#6B7280] text-sm font-medium">{(eventType as any).user?.name}</p>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mt-1">{eventType.name}</h1>

          {eventType.description && (
            <p className="text-[#6B7280] text-sm mt-3">{eventType.description}</p>
          )}

          <div className="flex items-center gap-2 mt-4 text-[#6B7280] text-sm">
            <Clock size={14} />
            <span>{eventType.duration} minutes</span>
          </div>

          {selectedDate && selectedSlot && (
            <div className="mt-4 p-3 bg-[#EEF4FF] rounded-lg text-sm">
              <p className="font-semibold text-[#1A1A2E]">{format(selectedDate, "EEEE, MMMM d")}</p>
              <p className="text-[#006BFF] mt-0.5">
                {format(new Date(selectedSlot.startTime), "h:mm a")} - {format(new Date(selectedSlot.endTime), "h:mm a")}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 text-[#6B7280] text-xs">
            <Globe size={12} />
            <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </div>

        {/* RIGHT PANEL — calendar, slots, or booking form */}
        <div className="flex-1 p-8">
          {!showForm ? (
            <>
              <h2 className="font-semibold text-[#1A1A2E] mb-4">Select a Date & Time</h2>
              <CalendarPicker selectedDate={selectedDate} onSelectDate={handleDateSelect} />

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="font-medium text-[#1A1A2E] mb-3 text-sm">
                    {format(selectedDate, "EEEE, MMMM d")}
                  </h3>
                  <TimeSlotGrid
                    slots={slots || []}
                    selectedSlot={selectedSlot}
                    onSelectSlot={handleSlotSelect}
                    isLoading={isSlotsLoading}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to time selection
              </button>
              <h2 className="font-semibold text-[#1A1A2E] mb-4">Enter Your Details</h2>
              <BookingForm
                onSubmit={handleBookingSubmit}
                onBack={() => setShowForm(false)}
                isLoading={isBooking}
                startTime={new Date(selectedSlot!.startTime)}
                endTime={new Date(selectedSlot!.endTime)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
