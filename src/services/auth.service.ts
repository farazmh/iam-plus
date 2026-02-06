import { users, User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export class AuthService {
	static async register(email: string, password: string): Promise<User> {
		const existing = users.find(u => u.email === email);
		if (existing) {
			throw new Error("User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser: User = {
			id: uuid(),
			email,
			password: hashedPassword,
			createdAt: new Date(),
		};

		users.push(newUser);

		return newUser;
	}

	static async login(email: string, password: string) {
		const user = users.find(u => u.email === email);

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
