"use client";

import { EventType } from "../../../types";
import { Clock, Copy, Edit2, Trash2, ExternalLink, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../ui/badge";

interface EventCardProps {
  eventType: EventType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopyLink: (slug: string) => void;
}

export function EventCard({ eventType, onEdit, onDelete, onCopyLink }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 p-5 flex items-center gap-5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative left accent */}
      <div 
        className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3"
        style={{ backgroundColor: eventType.color }}
      />

      {/* Modern Color Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
        style={{ backgroundColor: eventType.color + "15" }}
      >
        <CalendarDays size={20} style={{ color: eventType.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-base truncate">{eventType.name}</h3>
            {!eventType.isActive && (
              <Badge variant="outline" className="text-[10px] py-0 h-4 uppercase bg-gray-50 text-gray-400 border-gray-200">Inactive</Badge>
            )}
        </div>
        
        {eventType.description ? (
          <p className="text-xs text-gray-500 truncate mt-0.5 line-clamp-1">{eventType.description}</p>
        ) : (
          <p className="text-xs text-gray-400 italic mt-0.5">No description provided</p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-[10px] gap-1 px-2 py-0.5 font-bold bg-blue-50 text-blue-600 border-transparent">
            <Clock size={10} strokeWidth={3} />
            {eventType.duration} MIN
          </Badge>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Fixed Duration 
          </div>
        </div>
      </div>

      {/* Elegant Action Group */}
      <div className={`flex items-center gap-1.5 transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}>
        <div className="flex bg-white/80 backdrop-blur-md border border-gray-100 p-1 rounded-xl shadow-xl">
            <button
              onClick={() => onCopyLink(eventType.slug)}
              title="Copy booking link"
              className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Copy size={16} />
            </button>
            <a
              href={`/book/${eventType.slug}`}
              target="_blank"
              title="Open booking page"
              className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={() => onEdit(eventType.id)}
              title="Edit"
              className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <div className="w-px h-100 bg-gray-100 mx-1" />
            <button
              onClick={() => onDelete(eventType.id)}
              title="Delete"
              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}
