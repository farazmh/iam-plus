import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/me", verifyAccessToken, (req, res) => {
  return res.json({
    message: "Token valid",
    user: (req as any).user
  });
});

export default router;
