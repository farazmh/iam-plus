import { Request, Response, NextFunction } from "express";
import { RBACService } from "../services/rbac.service";

export const requirePermission = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hasPermission = await RBACService.userHasPermission(
      user.userId,
      action
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Forbidden: Missing permission" });
    }

    next();
  };
};
