import { NextRequest, NextResponse } from "next/server";
import * as eventTypeService from "../../../../../server/services/eventTypeService";
import { getDemoUser } from "../../../../../server/services/authService";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getDemoUser();
    const body = await request.json();
    const updatedRecord = await eventTypeService.update(params.id, user.id, body);
    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getDemoUser();
    await eventTypeService.remove(params.id, user.id);
    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}