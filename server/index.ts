import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventTypesRouter from "./routes/eventTypes";
import availabilityRouter from "./routes/availability";
import meetingsRouter from "./routes/meetings";
import publicRouter from "./routes/public";

// Initialize environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing application/json data

// Routing
// Keep all authenticated dashboard routes separate from public booking
app.use("/api/event-types", eventTypesRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/meetings", meetingsRouter);
app.use("/api/public", publicRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: "Server is running healthy" });
});

app.listen(PORT, () => {
  console.log(`Express API is active on port \${PORT}`);
});
