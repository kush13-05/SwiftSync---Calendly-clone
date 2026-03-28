import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import * as slotService from "../../../../../../server/services/slotService";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ success: false, error: "Missing date query parameter" }, { status: 400 });
    }

    const eventType = await prisma.eventType.findUnique({
      where: { slug: params.slug, isActive: true }
    });

    if (!eventType) {
      return NextResponse.json({ success: false, error: "Event type not found" }, { status: 404 });
    }

    const slots = await slotService.getAvailableTimeSlots(eventType.userId, eventType.id, eventType.duration, dateStr);

    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}