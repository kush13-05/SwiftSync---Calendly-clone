"use client";

import { MeetingWithEventType } from "../../../types";
import { format, isPast } from "date-fns";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { User, Calendar, Clock, MapPin } from "lucide-react";

interface MeetingRowProps {
  meeting: MeetingWithEventType;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}

export function MeetingRow({ meeting, onCancel, isCancelling }: MeetingRowProps) {
  const meetingIsPast = isPast(new Date(meeting.endTime));
  const isCancelled = meeting.status === "CANCELLED";
  const eventColor = (meeting.eventType as any)?.color || "#006BFF";

  return (
    <div className="group flex items-center gap-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5">
      {/* Left detail group */}
      <div className="flex items-center gap-4 flex-1">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg relative"
          style={{ backgroundColor: eventColor }}
        >
          <User size={22} strokeWidth={2.5} />
          {isCancelled && (
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
             </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-extrabold text-gray-900 text-base">{meeting.inviteeName}</p>
            <Badge 
              variant="outline" 
              className="text-[10px] uppercase font-bold tracking-widest px-2 py-0 border-transparent"
              style={{ backgroundColor: eventColor + "15", color: eventColor }}
            >
              {(meeting.eventType as any)?.name}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
             <span className="flex items-center gap-1"><MapPin size={12} className="text-gray-300" /> Video Call</span>
             <span className="flex items-center gap-1"><Calendar size={12} className="text-gray-300" /> {format(new Date(meeting.startTime), "EEE, MMM d")}</span>
          </div>
        </div>
      </div>

      {/* Time & Action group */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
           <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Clock size={14} className="text-primary" />
              {format(new Date(meeting.startTime), "h:mm a")}
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
             Local Time
           </p>
        </div>

        <div className="flex gap-2">
            {!meetingIsPast && !isCancelled ? (
                <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(meeting.id)}
                disabled={isCancelling}
                className="bg-white border-gray-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl px-4 font-bold transition-all shadow-sm"
                >
                Cancel
                </Button>
            ) : isCancelled ? (
                <Badge variant="secondary" className="bg-red-50 text-red-400 border-none font-bold py-1 px-3 rounded-lg flex-shrink-0">
                   CANCELLED
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-400 border-none font-bold py-1 px-3 rounded-lg flex-shrink-0">
                   PAST
                </Badge>
            )}
        </div>
      </div>
    </div>
  );
}
