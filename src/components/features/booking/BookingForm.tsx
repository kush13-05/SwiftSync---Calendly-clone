"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingInput } from "../../../lib/validations";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";

interface BookingFormProps {
  onSubmit: (data: BookingInput) => void;
  onBack: () => void;
  isLoading: boolean;
  startTime: Date;
  endTime: Date;
}

export function BookingForm({ onSubmit, onBack, isLoading, startTime, endTime }: BookingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      inviteeName: "",
      inviteeEmail: "",
      inviteeNotes: "",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      {/* Hidden fields to carry slot time context */}
      <input type="hidden" {...register("startTime")} />
      <input type="hidden" {...register("endTime")} />
      <input type="hidden" {...register("timezone")} />

      <div>
        <Label htmlFor="inviteeName">Your Name</Label>
        <Input
          id="inviteeName"
          {...register("inviteeName")}
          placeholder="Jane Smith"
          className="mt-1"
        />
        {errors.inviteeName && <p className="text-xs text-red-500 mt-1">{errors.inviteeName.message}</p>}
      </div>

      <div>
        <Label htmlFor="inviteeEmail">Email</Label>
        <Input
          id="inviteeEmail"
          type="email"
          {...register("inviteeEmail")}
          placeholder="jane@example.com"
          className="mt-1"
        />
        {errors.inviteeEmail && <p className="text-xs text-red-500 mt-1">{errors.inviteeEmail.message}</p>}
      </div>

      <div>
        <Label htmlFor="inviteeNotes">Notes (optional)</Label>
        <textarea
          id="inviteeNotes"
          {...register("inviteeNotes")}
          placeholder="Anything you'd like us to know beforehand?"
          rows={3}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#006BFF]"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1 bg-[#006BFF] hover:bg-blue-700 text-white">
          {isLoading ? "Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </form>
  );
}
