import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "devaccesssecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "devrefreshsecret";

export const generateAccessToken = (userId: string, email: string) => {
  return jwt.sign(
    { userId, email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
