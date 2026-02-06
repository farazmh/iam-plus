export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  endpoint: string;
  ip: string;
  createdAt: Date;
}

export const auditLogs: AuditLog[] = [];
