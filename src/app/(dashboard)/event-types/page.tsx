"use client";

import { useState } from "react";
import { useEventTypes } from "../../../hooks/useEventTypes";
import { EventCard } from "../../../components/features/event-types/EventCard";
import { CreateEventModal } from "../../../components/features/event-types/CreateEventModal";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { EventTypeInput } from "../../../lib/validations";
import { EventType } from "../../../types";

export default function EventTypesPage() {
  const { eventTypes, isLoading, isError, createEventType, isCreating, updateEventType, isUpdating, deleteEventType } = useEventTypes();
  
  // Controls which modal is visible and which event is being edited
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  function handleEdit(id: string) {
    const event = eventTypes?.find((e) => e.id === id) || null;
    setEditingEvent(event);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this event type?")) {
      deleteEventType(id);
    }
  }

  function handleCopyLink(slug: string) {
    const bookingUrl = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(bookingUrl);
    alert("Booking link copied!");
  }

  function handleCreateSubmit(data: EventTypeInput) {
    createEventType(data);
  }

  function handleEditSubmit(data: EventTypeInput) {
    if (editingEvent) {
      updateEventType({ id: editingEvent.id, data });
      setEditingEvent(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Event Types</h1>
          <p className="text-[#6B7280] mt-1">Create and manage your booking event types</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#006BFF] hover:bg-blue-700 text-white gap-2"
        >
          <Plus size={16} />
          New Event Type
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          <p>Failed to load event types. Is the Express server running on port 3001?</p>
        </div>
      )}

      {!isLoading && !isError && eventTypes && (
        <div className="space-y-3">
          {eventTypes.length === 0 ? (
            <div className="text-center py-16 text-[#6B7280]">
              <p className="text-lg font-medium">No event types yet</p>
              <p className="text-sm mt-1">Create your first event type to start accepting bookings</p>
            </div>
          ) : (
            eventTypes.map((event) => (
              <EventCard
                key={event.id}
                eventType={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopyLink={handleCopyLink}
              />
            ))
          )}
        </div>
      )}

      {/* Create modal */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      {/* Edit modal — opens when editingEvent is set */}
      {editingEvent && (
        <CreateEventModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleEditSubmit}
          isLoading={isUpdating}
          initialData={{ ...editingEvent, description: editingEvent.description ?? undefined }}
        />
      )}
    </div>
  );
}
