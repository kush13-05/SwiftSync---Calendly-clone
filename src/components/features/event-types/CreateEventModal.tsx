"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventTypeSchema, EventTypeInput } from "../../../lib/validations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventTypeInput) => void;
  isLoading: boolean;
  initialData?: EventTypeInput & { id: string };
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const COLOR_OPTIONS = ["#006BFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export function CreateEventModal({ isOpen, onClose, onSubmit, isLoading, initialData }: CreateEventModalProps) {
  const [selectedColor, setSelectedColor] = useState(initialData?.color || "#006BFF");

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<EventTypeInput>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      duration: 30,
      color: "#006BFF",
      isActive: true,
    },
  });

  // Ensure form is reactive to initialData when opening in edit mode
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        duration: initialData.duration,
        color: initialData.color,
        isActive: initialData.isActive,
      });
      setSelectedColor(initialData.color);
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        duration: 30,
        color: "#006BFF",
        isActive: true,
      });
      setSelectedColor("#006BFF");
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit: SubmitHandler<EventTypeInput> = (data) => {
    onSubmit({ ...data, color: selectedColor });
    onClose();
  };

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    setValue("color", color);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Event Type" : "Create New Event Type"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Configure your booking event settings below. 
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Event Name</Label>
            <Input 
              id="name" 
              {...register("name")} 
              placeholder="e.g. 30 Min Meeting" 
              className="bg-white border-gray-200 focus:ring-[#006BFF] transition-all rounded-xl" 
            />
            {errors.name && <p className="text-xs font-medium text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">Slug (URL)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">calendly.com/user/</span>
              <Input 
                id="slug" 
                {...register("slug")} 
                placeholder="slug" 
                className="pl-[115px] bg-white border-gray-200 focus:ring-[#006BFF] rounded-xl" 
              />
            </div>
            {errors.slug && <p className="text-xs font-medium text-destructive mt-1">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description (optional)</Label>
            <Input 
              id="description" 
              {...register("description")} 
              placeholder="A short description..." 
              className="bg-white border-gray-200 focus:ring-[#006BFF] rounded-xl" 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Duration</Label>
            <div className="flex gap-2 flex-wrap">
              {DURATION_OPTIONS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setValue("duration", mins)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    watch("duration") === mins 
                      ? "bg-[#006BFF] text-white border-[#006BFF] shadow-md shadow-blue-200" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Color</Label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? "ring-2 ring-gray-900 ring-offset-2 border-transparent scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-500 hover:bg-gray-100 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-[#006BFF] hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl">
              {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
