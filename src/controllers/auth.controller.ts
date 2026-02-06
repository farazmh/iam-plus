import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { refreshTokens } from "../models/token.model";
import jwt from "jsonwebtoken";

export class AuthController {
	static async register(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({ error: "Email and password are required" });
			}

			const user = await AuthService.register(email, password);

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

			if (!email || !password) {
				return res.status(400).json({ error: "Email and password are required" });
			}

			const user = await AuthService.login(email, password);

			const accessToken = generateAccessToken(user.id, user.email);
			const refreshToken = generateRefreshToken(user.id);
			refreshTokens.push({
				token: refreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
			});

			return res.status(200).json({
				message: "Login successful",
				tokens: {
					accessToken,
					refreshToken
				},
				user: {
					id: user.id,
					email: user.email,
					createdAt: user.createdAt
				}
			});
		} catch (err: any) {
			return res.status(400).json({ error: err.message });
		}
	}

	static async refresh(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				return res.status(400).json({ error: "Refresh token required" });
			}

			const stored = refreshTokens.find(rt => rt.token === refreshToken);

			if (!stored) {
				return res.status(401).json({ error: "Invalid refresh token" });
			}

			if (stored.expiresAt < new Date()) {
				return res.status(401).json({ error: "Refresh token expired" });
			}

			// verify token
			const decoded = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET || "devrefreshsecret"
			) as { userId: string };

			const newAccessToken = generateAccessToken(decoded.userId, "");

			return res.json({
				message: "Token refreshed",
				accessToken: newAccessToken
			});
		} catch (err: any) {
			return res.status(401).json({ error: "Invalid refresh token" });
		}
	}
}
