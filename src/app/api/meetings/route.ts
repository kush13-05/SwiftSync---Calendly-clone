import { NextResponse } from "next/server";
import * as meetingService from "../../../../server/services/meetingService";
import { getDemoUser } from "../../../../server/services/authService";

export async function GET() {
  try {
    const user = await getDemoUser();
    const records = await meetingService.getAll(user.id);
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}