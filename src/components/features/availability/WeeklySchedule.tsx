"use client";

import { Availability } from "../../../types";
import { DayRow } from "./DayRow";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]; 

interface WeeklyScheduleProps {
  availabilityRecords: Availability[];
  onSave: (data: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>) => void;
  isSaving: boolean;
}

export function WeeklySchedule({ availabilityRecords, onSave, isSaving }: WeeklyScheduleProps) {
  const [scheduleMap, setScheduleMap] = useState<Record<number, Availability>>({});

  useEffect(() => {
    const map: Record<number, Availability> = {};
    for (const record of availabilityRecords) {
      map[record.dayOfWeek] = record;
    }
    setScheduleMap(map);
  }, [availabilityRecords]);

  function handleDayChange(dayOfWeek: number, field: "isActive" | "startTime" | "endTime", value: string | boolean) {
    setScheduleMap((prev) => {
      const existing = prev[dayOfWeek] || {
        id: "",
        userId: "",
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
        isActive: false,
      };
      return {
        ...prev,
        [dayOfWeek]: { ...existing, [field]: value },
      };
    });
  }

  function handleSave() {
    const flatData = ALL_DAYS.map((day) => {
      const record = scheduleMap[day];
      return {
        dayOfWeek: day,
        startTime: record?.startTime ?? "09:00",
        endTime: record?.endTime ?? "17:00",
        isActive: record?.isActive ?? false,
      };
    });
    onSave(flatData);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {ALL_DAYS.map((dayIndex) => (
          <DayRow
            key={dayIndex}
            dayOfWeek={dayIndex}
            availability={scheduleMap[dayIndex]}
            onChange={handleDayChange}
          />
        ))}
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-400 font-medium">
          Your availability is synchronized across all active event types.
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#006BFF] hover:bg-blue-700 text-white px-8 h-12 rounded-2xl font-extrabold shadow-lg shadow-blue-200 transition-all active:scale-95 gap-2"
        >
          {isSaving ? (
             "Saving..."
          ) : (
            <>
              <Save size={18} strokeWidth={2.5} />
              Save Availability
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
