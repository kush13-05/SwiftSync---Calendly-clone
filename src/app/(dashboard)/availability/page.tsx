"use client";

import { useAvailability } from "../../../hooks/useAvailability";
import { WeeklySchedule } from "../../../components/features/availability/WeeklySchedule";

export default function AvailabilityPage() {
  const { availability, isLoading, isError, updateAvailability, isUpdating } = useAvailability();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Availability</h1>
        <p className="text-[#6B7280] mt-1">Set your weekly hours when clients can book you</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <h2 className="font-semibold text-[#1A1A2E] mb-4">Weekly Hours</h2>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-sm">Failed to load availability. Is the server running?</p>
        )}

        {!isLoading && !isError && availability && (
          <WeeklySchedule
            availabilityRecords={availability}
            onSave={updateAvailability}
            isSaving={isUpdating}
          />
        )}
      </div>
    </div>
  );
}
