import { Request, Response } from "express";
import * as eventTypeService from "../services/eventTypeService";
import { getDemoUser } from "../services/authService";

export async function getEventTypes(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const records = await eventTypeService.getAll(user.id);
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createEventType(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const newRecord = await eventTypeService.create(user.id, req.body);
    res.json({ success: true, data: newRecord });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateEventType(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const id = req.params.id as string;
    const updatedRecord = await eventTypeService.update(id, user.id, req.body);
    res.json({ success: true, data: updatedRecord });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteEventType(req: Request, res: Response) {
  try {
    const user = await getDemoUser();
    const id = req.params.id as string;
    await eventTypeService.remove(id, user.id);
    res.json({ success: true, data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
