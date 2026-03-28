import { NextRequest, NextResponse } from "next/server";
import * as availabilityService from "../../../../server/services/availabilityService";
import { getDemoUser } from "../../../../server/services/authService";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getDemoUser();
    const records = await availabilityService.getAll(user.id);
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getDemoUser();
    const body = await request.json();
    const updatedRecords = await availabilityService.bulkUpdate(user.id, body.availability);
    return NextResponse.json({ success: true, data: updatedRecords });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}