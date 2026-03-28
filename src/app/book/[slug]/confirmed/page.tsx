"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Calendar, Users } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function BookingConfirmedPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 max-w-md w-full text-center relative overflow-hidden">
        {/* Success background decorative pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
        
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#EEF4FF] flex items-center justify-center rotate-3 shadow-md shadow-blue-100/50">
            <CheckCircle size={44} className="text-[#006BFF]" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight">You're confirmed!</h1>
        <p className="text-[#6B7280] mt-4 text-sm leading-relaxed font-medium">
          Your booking has been successfully recorded in the SwiftSync platform. We look forward to our meeting!
        </p>

        <div className="mt-10 p-5 bg-gray-50/80 rounded-2xl text-left border border-gray-100 space-y-4 shadow-inner">
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Calendar size={16} className="text-[#006BFF]" />
            </div>
            <span className="font-bold">Recorded in Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Users size={16} className="text-[#006BFF]" />
            </div>
            <span className="font-bold">Syncing with Host Calendar</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Link href={`/book/${slug}`}>
            <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50 rounded-xl font-bold transition-all hover:scale-[1.02]">
              Book Another Time
            </Button>
          </Link>
          <Link href="/event-types">
            <Button className="w-full h-11 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
