"use client";

import { useMeetings } from "../../../hooks/useMeetings";
import { MeetingTabs } from "../../../components/features/meetings/MeetingTabs";

export default function MeetingsPage() {
  const { meetings, isLoading, isError, cancelMeeting, isCancelling } = useMeetings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Meetings</h1>
        <p className="text-[#6B7280] mt-1">Manage all your scheduled bookings</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-500 text-sm text-center py-10">
          Failed to load meetings. Make sure the Express server is running on port 3001.
        </p>
      )}

      {!isLoading && !isError && meetings && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <MeetingTabs
            meetings={meetings}
            onCancel={cancelMeeting}
            isCancelling={isCancelling}
          />
        </div>
      )}
    </div>
  );
}
