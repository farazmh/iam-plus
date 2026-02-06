import { Router } from "express";
import { RBACService } from "../services/rbac.service";
import { requirePermission } from "../middleware/permission.middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";

const router = Router();

// Only ADMIN can modify RBAC
router.use(verifyAccessToken, requirePermission("admin.rbac"));

router.post("/role", async (req, res) => {
  const { name, description } = req.body;
  const role = await RBACService.createRole(name, description);
  res.json(role);
});

router.post("/permission", async (req, res) => {
  const { action, description } = req.body;
  const perm = await RBACService.createPermission(action, description);
  res.json(perm);
});

router.post("/role/assign", async (req, res) => {
  const { userId, roleName } = req.body;
  const result = await RBACService.assignRoleToUser(userId, roleName);
  res.json(result);
});

router.post("/role/attach-permission", async (req, res) => {
  const { roleName, action } = req.body;
  const result = await RBACService.attachPermissionToRole(roleName, action);
  res.json(result);
});

export default router;
