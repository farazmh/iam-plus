import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from "dotenv";

dotenv.config();

// Ensure your DATABASE_URL environment variable is loaded (e.g., using dotenv)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding IAM baseline...");

  // 1️⃣ Create admin permission
  const adminPermission = await prisma.permission.upsert({
    where: { action: "admin.rbac" },
    update: {},
    create: {
      action: "admin.rbac",
      description: "Full RBAC management access",
    },
  });

  // 2️⃣ Create admin role
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "System administrator",
    },
  });

  // 3️⃣ Attach admin.rbac permission to admin role
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: adminPermission.id
      }
    } as any, // Add 'as any' if TypeScript complains, or update the Prisma schema if needed
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: adminPermission.id,
    },
  });

  // 4️⃣ Create default admin user (email + password)
  const defaultAdminEmail = "admin@iam.plus";
  const defaultAdminPassword = "$2a$10$3C4uxjkEYB2u5ObXBmYtOe8HwDgClJYtVfVigZ9Vdgiqy8GQXGskW";
  // password = "admin123" (bcrypt hashed)

  const adminUser = await prisma.user.upsert({
    where: { email: defaultAdminEmail },
    update: {},
    create: {
      email: defaultAdminEmail,
      password: defaultAdminPassword,
    },
  });

  // 5️⃣ Assign admin role to the seeded admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    } as any, // Remove 'as any' if your Prisma schema actually defines userId_roleId as a unique constraint
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log("➡️ Admin user:");
  console.log("   Email: admin@iam.plus");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
