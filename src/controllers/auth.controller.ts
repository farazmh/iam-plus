import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { NotificationClient } from "../services/notificationClient";

export class AuthController {
	static async register(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({ error: "Email and password are required" });
			}

			const user = await AuthService.register(email, password);
			await NotificationClient.sendWelcomeEmail(user.email, user.email.split("@")[0]);

			return res.status(201).json({
				message: "User registered successfully",
				user: {
					id: user.id,
					email: user.email,
					createdAt: user.createdAt,
				}
			});
		} catch (err: any) {
			return res.status(400).json({ error: err.message });
		}
	}

	static async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const user = await AuthService.login(email, password);

			const accessToken = generateAccessToken(user.id, user.email);
			const refreshToken = generateRefreshToken(user.id);

			await prisma.refreshToken.create({
				data: {
					token: refreshToken,
					userId: user.id,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				},
			});

			return res.json({
				message: "Login successful",
				tokens: { accessToken, refreshToken },
				user: {
					id: user.id,
					email: user.email,
					createdAt: user.createdAt,
				},
			});
		} catch (err: any) {
			return res.status(400).json({ error: err.message });
		}
	}

	static async refresh(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body;

			const stored = await prisma.refreshToken.findFirst({
				where: { token: refreshToken },
			});

			if (!stored) {
				return res.status(401).json({ error: "Invalid refresh token" });
			}

			if (stored.expiresAt < new Date()) {
				return res.status(401).json({ error: "Refresh token expired" });
			}

			const decoded: any = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET || "devrefreshsecret"
			);

			const newAccessToken = generateAccessToken(decoded.userId, "");

			return res.json({
				message: "Token refreshed",
				accessToken: newAccessToken,
			});
		} catch (err) {
			return res.status(401).json({ error: "Invalid refresh token" });
		}
	}
}
