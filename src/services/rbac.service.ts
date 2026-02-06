import { prisma } from "../db/prisma";

export class RBACService {
  static async assignRoleToUser(userId: string, roleName: string) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });

    if (!role) throw new Error("Role not found");

    return prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
    });
  }

  static async createRole(name: string, description?: string) {
    return prisma.role.create({
      data: { name, description },
    });
  }

  static async createPermission(action: string, description?: string) {
    return prisma.permission.create({
      data: { action, description },
    });
  }

  static async attachPermissionToRole(roleName: string, action: string) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    const permission = await prisma.permission.findUnique({ where: { action } });

    if (!role || !permission) throw new Error("Role or permission not found");

    return prisma.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }

  static async userHasPermission(userId: string, action: string) {
    const permission = await prisma.permission.findUnique({
      where: { action },
    });

    if (!permission) return false;

    const rolePerm = await prisma.rolePermission.findMany({
      where: { permissionId: permission.id },
      include: { role: true },
    });

    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    const userRoleIds = new Set(userRoles.map((ur) => ur.roleId));

    return rolePerm.some((rp) => userRoleIds.has(rp.roleId));
  }
}
