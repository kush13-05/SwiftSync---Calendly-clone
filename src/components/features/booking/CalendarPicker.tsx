"use client";

import { DayPicker } from "react-day-picker";
import { isBefore, startOfDay, format } from "date-fns";
import "react-day-picker/style.css";

interface CalendarPickerProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
}

export function CalendarPicker({ selectedDate, onSelectDate }: CalendarPickerProps) {
  // All days in the past should not be selectable
  const today = startOfDay(new Date());

  function handleSelect(date: Date | undefined) {
    if (date) {
      onSelectDate(date);
    }
  }

  return (
    <div className="flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={[{ before: today }]}
        showOutsideDays={false}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full",
          month_caption: "flex justify-center items-center py-3 font-semibold text-[#1A1A2E]",
          nav: "flex items-center gap-1",
          button_previous: "p-1 rounded-lg hover:bg-[#EEF4FF] transition-colors text-[#6B7280]",
          button_next: "p-1 rounded-lg hover:bg-[#EEF4FF] transition-colors text-[#6B7280]",
          weeks: "w-full",
          weekdays: "flex mb-1",
          weekday: "flex-1 text-center text-xs font-medium text-[#6B7280] py-2",
          week: "flex",
          day: "flex-1 aspect-square flex items-center justify-center",
          day_button: "w-9 h-9 rounded-full text-sm font-medium transition-all hover:bg-[#EEF4FF] hover:text-[#006BFF]",
          selected: "bg-[#006BFF] text-white rounded-full hover:bg-[#006BFF]",
          today: "font-bold",
          disabled: "opacity-30 cursor-not-allowed",
          outside: "opacity-0 pointer-events-none",
        }}
      />
    </div>
  );
}
