import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimiter.middleware";
import { auditLogs } from "../models/audit.model";

const router = Router();

router.post("/register", authRateLimiter, AuthController.register);
router.post("/login", authRateLimiter, AuthController.login);
router.post("/refresh", AuthController.refresh);

router.get("/me", verifyAccessToken, (req, res) => {
  return res.json({
    message: "Token valid",
    user: (req as any).user
  });
});

router.get("/audit", (req, res) => res.json(auditLogs));

export default router;
