import { prisma } from "../db/prisma";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export class OAuthService {
  static async createClient(name: string, redirectUris: string[]) {
    const clientId = uuid();
    const clientSecret = crypto.randomBytes(32).toString("hex");

    return prisma.oAuthClient.create({
      data: {
        name,
        clientId,
        clientSecret,
        redirectUris,
      },
    });
  }

  static async getClientById(clientId: string) {
    return prisma.oAuthClient.findUnique({
      where: { clientId },
    });
  }
}
