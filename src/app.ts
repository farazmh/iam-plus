import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware";
import { auditLogger } from "./middleware/audit.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(globalRateLimiter);
app.use(auditLogger);

app.get("/", (req, res) => {
  res.send({ message: "IAM Plus API is running" });
});

// add this:
app.use("/auth", authRoutes);

export default app;
