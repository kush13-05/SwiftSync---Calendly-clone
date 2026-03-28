import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "../../../../../lib/validations";
import prisma from "../../../../../lib/prisma";
import * as meetingService from "../../../../../../server/services/meetingService";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    const parsedData = bookingSchema.parse(body);

    const eventType = await prisma.eventType.findUnique({
      where: { slug: params.slug, isActive: true }
    });

    if (!eventType) {
      return NextResponse.json({ success: false, error: "Event type not found" }, { status: 404 });
    }

    const newMeeting = await meetingService.create(eventType.id, parsedData);

    return NextResponse.json({ success: true, data: newMeeting }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}