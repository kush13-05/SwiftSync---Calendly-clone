"use client";

import { TimeSlot } from "../../../types";
import { format } from "date-fns";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading: boolean;
}

export function TimeSlotGrid({ slots, selectedSlot, onSelectSlot, isLoading }: TimeSlotGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-[#6B7280]">
        <p className="text-sm">No available slots for this day.</p>
        <p className="text-xs mt-1">Try selecting a different date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
      {slots.map((slot) => {
        // Build a unique key from the ISO startTime string
        const slotKey = new Date(slot.startTime).toISOString();
        const isSelected = selectedSlot
          ? new Date(selectedSlot.startTime).toISOString() === slotKey
          : false;

        return (
          <button
            key={slotKey}
            onClick={() => onSelectSlot(slot)}
            className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
              isSelected
                ? "bg-[#006BFF] text-white border-[#006BFF] shadow-md"
                : "bg-white border-gray-200 text-[#1A1A2E] hover:border-[#006BFF] hover:text-[#006BFF]"
            }`}
          >
            {/* Format "startTime" to readable label like "9:00 AM" */}
            {format(new Date(slot.startTime), "h:mm a")}
          </button>
        );
      })}
    </div>
  );
}
