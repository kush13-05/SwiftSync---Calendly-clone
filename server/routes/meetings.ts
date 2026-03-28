import { Router } from "express";
import { getMeetings, cancelMeeting } from "../controllers/meetingController";

const router = Router();

// Retrieve user meetings dashboard data
router.get("/", getMeetings);

// Allows host to cancel a scheduled meeting
router.patch("/:id/cancel", cancelMeeting);

export default router;
