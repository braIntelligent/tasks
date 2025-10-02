import { User } from "@/schemas/mongo/user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

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

export const normalize = (str?: string) => {
  if (str) return str.toLowerCase().trim();
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 14);
};

export const comparePassword = async (
  password: string,
  passwordInDB: string
) => {
  return await bcrypt.compare(password, passwordInDB);
};

export const isEmailBlocked = (email?: string) => {
  if (email) {
    const blockDomains = ["tempmail.com", "10minutemail.com"];
    const domain = email.split("@")[1];
    return blockDomains.includes(domain);
  }
};

export const isEmailOrUsernameTaken = async (
  username?: string,
  email?: string
) => {
  const query: any = { $or: [] };
  if (username) query.$or.push({ username: normalize(username) });
  if (email) query.$or.push({ email: normalize(email) });

  if (query.$or.length === 0) return false;

  const user = await User.findOne(query).lean();
  if (!user) return false;

  return user;
};
