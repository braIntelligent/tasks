import { User } from "@/schemas/mongo/user.schema";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role: "admin" | "user";
        active: boolean;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({
        error: "Access denied. No token provided",
      });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
      return res.status(500).json({
        error: "JWT secret not configured",
      });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      password: string;
      role: "admin" | "user";
    };

    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    if (!user.active) {
      return res.status(401).json({
        error: "User account is disable",
      });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      active: user.active,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        error: "Invalid token",
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        error: "Token expired",
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin privileges required",
    });
  }

  next();
};

export const requireOwnershipOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const { id } = req.params;

  if (req.user.role === "admin" && req.user.id === id) {
    return next();
  }

  return res.status(403).json({
    error: "Access denied. You can only access your own resources",
  });
};
