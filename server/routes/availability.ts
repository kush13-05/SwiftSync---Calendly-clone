import { Router } from "express";
import { getAvailability, updateAvailability } from "../controllers/availabilityController";

const router = Router();

// Retrieve all weekly schedules
router.get("/", getAvailability);

// Bulk update weekly schedules
router.put("/", updateAvailability);

export default router;
