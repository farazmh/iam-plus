import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export class AuthService {
  static async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        id: uuid(),
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
