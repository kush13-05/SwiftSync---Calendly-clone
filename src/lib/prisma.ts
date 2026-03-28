import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables before creating the Prisma client
dotenv.config();

// Simple PrismaClient instantiation picking up DATABASE_URL from .env automatically
const prisma = new PrismaClient();

export default prisma;