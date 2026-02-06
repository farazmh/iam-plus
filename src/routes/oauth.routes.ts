import { Router } from "express";
import { OAuthService } from "../services/oauth.service";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { OAuthController } from "../controllers/oauth.controller";

const router = Router();

// Only admins can create OAuth clients
router.post(
  "/client",
  verifyAccessToken,
  requirePermission("admin.rbac"),
  async (req, res) => {
    const { name, redirectUris } = req.body;

    const client = await OAuthService.createClient(name, redirectUris);

    res.json({
      message: "OAuth client created",
      clientId: client.clientId,
      clientSecret: client.clientSecret,
    });
  }
);

router.get("/authorize", OAuthController.authorize);
router.post("/authorize/decision", OAuthController.authorizeDecision);
router.post("/token", OAuthController.token);
router.post("/introspect", OAuthController.introspect);

export default router;
