import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (user: any) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = "30d";

  const randomString = crypto.randomBytes(64).toString("hex");

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign(
    {
      refreshToken: randomString,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const logout = () => {};
