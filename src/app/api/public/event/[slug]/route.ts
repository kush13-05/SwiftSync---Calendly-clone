import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const eventType = await prisma.eventType.findUnique({
      where: { slug: params.slug, isActive: true },
      include: { user: { select: { name: true, timezone: true } } }
    });

    if (!eventType) {
      return NextResponse.json({ success: false, error: "Event type not found or inactive" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: eventType });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}