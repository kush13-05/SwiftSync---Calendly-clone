"use client";

import { Availability } from "../../../types";
import { Switch } from "../../ui/switch";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Half-hour interval options for all day selects
const TIME_OPTIONS: string[] = [];
for (let hour = 0; hour < 24; hour++) {
  for (const minute of [0, 30]) {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    TIME_OPTIONS.push(`${h}:${m}`);
  }
}

interface DayRowProps {
  dayOfWeek: number;
  availability: Availability | undefined;
  onChange: (dayOfWeek: number, field: "isActive" | "startTime" | "endTime", value: string | boolean) => void;
}

export function DayRow({ dayOfWeek, availability, onChange }: DayRowProps) {
  const isActive = availability?.isActive ?? false;
  const startTime = availability?.startTime ?? "09:00";
  const endTime = availability?.endTime ?? "17:00";

  return (
    <div className={`flex items-center gap-6 py-4 px-6 rounded-2xl border transition-all duration-300 ${
      isActive 
        ? "bg-white border-white shadow-sm ring-1 ring-blue-50/50" 
        : "bg-gray-100/50 border-transparent opacity-60 grayscale-[0.5]"
    }`}>
      {/* Toggle to enable/disable this day */}
      <div className="flex items-center">
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => onChange(dayOfWeek, "isActive", checked)}
        />
      </div>

      {/* Day name label */}
      <div className="w-24">
        <span className={`font-extrabold text-sm uppercase tracking-tight ${isActive ? "text-gray-900" : "text-gray-400"}`}>
          {DAY_NAMES[dayOfWeek].slice(0, 3)}
        </span>
      </div>

      {/* Time selectors */}
      <div className={`flex items-center gap-3 transition-opacity ${isActive ? "opacity-100" : "opacity-30"}`}>
        <select
          value={startTime}
          disabled={!isActive}
          onChange={(e) => onChange(dayOfWeek, "startTime", e.target.value)}
          className="text-xs font-bold border border-gray-100 rounded-xl px-4 py-2 bg-gray-50/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#006BFF] transition-all"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>{formatTime(t)}</option>
          ))}
        </select>

        <span className="text-gray-300 text-[10px] font-bold uppercase">To</span>

        <select
          value={endTime}
          disabled={!isActive}
          onChange={(e) => onChange(dayOfWeek, "endTime", e.target.value)}
          className="text-xs font-bold border border-gray-100 rounded-xl px-4 py-2 bg-gray-50/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#006BFF] transition-all"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>{formatTime(t)}</option>
          ))}
        </select>
      </div>

      {/* Status Badge */}
      <div className="ml-auto hidden sm:block">
        {isActive ? (
          <span className="text-[10px] font-extrabold text-[#006BFF] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest">Available</span>
        ) : (
          <span className="text-[10px] font-extrabold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-widest">Unavailable</span>
        )}
      </div>
    </div>
  );
}

// Converts HH:MM 24-hour to 12-hour format label
function formatTime(hhmm: string): string {
  const [hourStr, minuteStr] = hhmm.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}
