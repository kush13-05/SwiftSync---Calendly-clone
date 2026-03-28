import { NextRequest, NextResponse } from "next/server";
import * as eventTypeService from "../../../../server/services/eventTypeService";
import { getDemoUser } from "../../../../server/services/authService";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getDemoUser();
    const records = await eventTypeService.getAll(user.id);
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getDemoUser();
    const body = await request.json();
    const newRecord = await eventTypeService.create(user.id, body);
    return NextResponse.json({ success: true, data: newRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}