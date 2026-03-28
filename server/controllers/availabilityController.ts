import { Request, Response } from "express";
import * as availabilityService from "../services/availabilityService";
import { getDemoUser } from "../services/authService";

export async function getAvailability(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const records = await availabilityService.getAll(user.id);
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateAvailability(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const updatedRecords = await availabilityService.updateBulk(user.id, req.body.availability);
    res.json({ success: true, data: updatedRecords });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
