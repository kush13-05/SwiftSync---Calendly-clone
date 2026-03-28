import { NextResponse } from "next/server";
import * as meetingService from "../../../../../../server/services/meetingService";
import { getDemoUser } from "../../../../../../server/services/authService";

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getDemoUser();
    const cancelledRecord = await meetingService.cancel(user.id, params.id);
    return NextResponse.json({ success: true, data: cancelledRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}