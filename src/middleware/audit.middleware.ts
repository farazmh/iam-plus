import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import { prisma } from "../db/prisma";

export const auditLogger = async(req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", async () => {
    const user = (req as any).user || null;

    await prisma.auditLog.create({
      data: {
        id: uuid(),
        userId: user ? user.userId : null,
        action: req.method,
        endpoint: req.originalUrl,
        ip: req.ip as string,
      },
    });
  });

  next();
};