import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

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

}
