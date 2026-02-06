export interface User {
  id: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
}

export const users: User[] = [];
