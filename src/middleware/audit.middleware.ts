import { Request, Response, NextFunction } from "express";
import { auditLogs } from "../models/audit.model";
import { v4 as uuid } from "uuid";

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user || null;

  auditLogs.push({
    id: uuid(),
    userId: user ? user.userId : null,
    action: req.method,
    endpoint: req.originalUrl,
    ip: req.ip,
    createdAt: new Date()
  });

  next();
};
