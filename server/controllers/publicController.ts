import { Request, Response } from "express";
import { bookingSchema } from "../../lib/validations";
import * as eventTypeService from "../services/eventTypeService";
import * as slotService from "../services/slotService";
import * as meetingService from "../services/meetingService";
import prisma from "../prisma";

export async function getEventDetails(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    
    // Using prisma inline just to fetch the event by slug since eventTypeService gets by userId
    const eventType = await prisma.eventType.findUnique({
      where: { slug, isActive: true },
      include: { user: { select: { name: true, timezone: true } } }
    });

    if (!eventType) {
      return res.status(404).json({ success: false, error: "Event type not found or inactive" });
    }

    res.json({ success: true, data: eventType });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    // Client passes date as string "2023-11-25"
    const dateStr = req.query.date as string;

    if (!dateStr) {
      return res.status(400).json({ success: false, error: "Missing date query parameter" });
    }

    const eventType = await prisma.eventType.findUnique({
      where: { slug, isActive: true }
    });

    if (!eventType) {
      return res.status(404).json({ success: false, error: "Event type not found" });
    }

    // Defer the heavy calculation logic explicitly to slotService as requested
    const slots = await slotService.getAvailableTimeSlots(eventType.userId, eventType.id, eventType.duration, dateStr);

    res.json({ success: true, data: slots });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function bookMeeting(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const parsedData = bookingSchema.parse(req.body);

    const eventType = await prisma.eventType.findUnique({
      where: { slug, isActive: true }
    });

    if (!eventType) {
      return res.status(404).json({ success: false, error: "Event type not found" });
    }

    // Call meetingService to permanently construct the meeting instance
    const newMeeting = await meetingService.create(eventType.id, parsedData);

    res.status(201).json({ success: true, data: newMeeting });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
}
