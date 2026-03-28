import { Request, Response } from "express";
import * as meetingService from "../services/meetingService";
import { getDemoUser } from "../services/authService";

export async function getMeetings(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const records = await meetingService.getAll(user.id);
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function cancelMeeting(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const { id } = req.params;
    const cancelledRecord = await meetingService.cancel(user.id, id);
    res.json({ success: true, data: cancelledRecord });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
