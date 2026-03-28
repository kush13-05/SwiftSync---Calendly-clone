import { Router } from "express";
import { 
  getEventDetails, 
  getAvailableSlots, 
  bookMeeting 
} from "../controllers/publicController";

const router = Router();

// Publicly resolves specific event details by creator slug
// GET /api/public/event/:slug
router.get("/event/:slug", getEventDetails);

// Fetch time slots for a specific date (YYYY-MM-DD string) 
// GET /api/public/slots/:slug?date=...
router.get("/slots/:slug", getAvailableSlots);

// Actually lock in a meeting
// POST /api/public/book/:slug
router.post("/book/:slug", bookMeeting);

export default router;
