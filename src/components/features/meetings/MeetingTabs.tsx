"use client";

import { MeetingWithEventType } from "../../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { MeetingRow } from "./MeetingRow";
import { isPast } from "date-fns";

interface MeetingTabsProps {
  meetings: MeetingWithEventType[];
  onCancel: (id: string) => void;
  isCancelling: boolean;
}

export function MeetingTabs({ meetings, onCancel, isCancelling }: MeetingTabsProps) {
  // Logic Fix: Any meeting that hasn't strictly ended yet is "Upcoming/Active"
  const upcomingMeetings = meetings.filter(
    (m) => m.status === "SCHEDULED" && !isPast(new Date(m.endTime))
  );
  
  // Only meetings that have strictly finished are "Past"
  const pastMeetings = meetings.filter(
    (m) => m.status === "SCHEDULED" && isPast(new Date(m.endTime))
  );
  
  const cancelledMeetings = meetings.filter((m) => m.status === "CANCELLED");

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="mb-6 bg-blue-50/50 p-1 rounded-xl">
        <TabsTrigger 
          value="upcoming" 
          className="rounded-lg px-4 py-2 font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-[#006BFF] data-[state=active]:shadow-md"
        >
          Upcoming ({upcomingMeetings.length})
        </TabsTrigger>
        <TabsTrigger 
          value="past" 
          className="rounded-lg px-4 py-2 font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-[#006BFF] data-[state=active]:shadow-md"
        >
          Past ({pastMeetings.length})
        </TabsTrigger>
        <TabsTrigger 
          value="cancelled" 
          className="rounded-lg px-4 py-2 font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-[#006BFF] data-[state=active]:shadow-md"
        >
          Cancelled ({cancelledMeetings.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <MeetingList meetings={upcomingMeetings} onCancel={onCancel} isCancelling={isCancelling} emptyMessage="No upcoming meetings. Share your booking link!" />
      </TabsContent>
      <TabsContent value="past" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <MeetingList meetings={pastMeetings} onCancel={onCancel} isCancelling={isCancelling} emptyMessage="No past meetings yet." />
      </TabsContent>
      <TabsContent value="cancelled" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <MeetingList meetings={cancelledMeetings} onCancel={onCancel} isCancelling={isCancelling} emptyMessage="No cancelled meetings." />
      </TabsContent>
    </Tabs>
  );
}

function MeetingList({ meetings, onCancel, isCancelling, emptyMessage }: {
  meetings: MeetingWithEventType[];
  onCancel: (id: string) => void;
  isCancelling: boolean;
  emptyMessage: string;
}) {
  if (meetings.length === 0) {
    return <p className="text-center text-gray-400 font-bold text-sm py-20">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <MeetingRow key={meeting.id} meeting={meeting} onCancel={onCancel} isCancelling={isCancelling} />
      ))}
    </div>
  );
}
