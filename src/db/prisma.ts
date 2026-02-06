import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from "dotenv";

dotenv.config();

// Ensure your DATABASE_URL environment variable is loaded (e.g., using dotenv)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });