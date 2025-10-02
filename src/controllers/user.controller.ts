import {
  comparePassword,
  hashPassword,
  isEmailBlocked,
  isEmailOrUsernameTaken,
  normalize,
} from "@/helpers/user.helpers";
import { User } from "@/schemas/mongo/user.schema";
import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

export const userController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password)
        return res.status(409).json({ error: "there are no parameters" });

      const user = await isEmailOrUsernameTaken(username, email);

      if (user) {
        if (
          user.username === normalize(username) &&
          user.email === normalize(email)
        ) {
          return res
            .status(409)
            .json({ error: "Email and Username already taken" });
        }
        if (user.email === normalize(email)) {
          return res.status(409).json({ error: "Email already registered" });
        }
        if (user.username === normalize(username)) {
          return res.status(409).json({ error: "Username already taken" });
        }
      }

      const hasedPassword = await hashPassword(password);

      const newUser = await User.create({
        username: normalize(username),
        email: normalize(email),
        password: hasedPassword,
      });

      const userResponse = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        tasks: newUser.tasks,
        active: newUser.active,
        createdAt: newUser.createdAt,
      };

      res
        .status(201)
        .json({ message: "User created succesfully", user: userResponse });
    } catch (error) {
      console.log("Error creating user:", error);
      res.status(500).json({ error: "Internal Error Server" });
    }
  },
  getUsers: async (_req: Request, res: Response) => {
    try {
      const users = await User.find().select("-password").lean();

      if (!users) return res.status(204).json({ message: "Users not found" });

      return res.status(200).json({ users });
    } catch (error) {
      console.log("Error getting users", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id) || !id)
        return res.status(409).json({ error: "Id not valid" });

      const user = await User.findById(id).select("-password").lean();

      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json({ user });
    } catch (error) {
      console.log("Error getting user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { newUsername, newEmail, newPassword, currentPassword } = req.body;

      if (!Types.ObjectId.isValid(id))
        return res.status(409).json({ error: "Id not valid" });

      const user = await User.findById(id).lean();

      if (!user) return res.status(404).json({ error: "User not found" });

      const isSamePassword = await comparePassword(
        currentPassword,
        user.password
      );

      if (!isSamePassword)
        return res
          .status(403)
          .json({ message: "Current password is incorrect" });

      if (!newUsername && !newEmail && !newPassword) {
        return res.status(409).json({ error: "there are no parameters" });
      }

      if (isEmailBlocked(newEmail)) {
        return res
          .status(409)
          .json({ error: "Email domain not allowed", field: "email" });
      }

      const updateData: any = {};

      if (newUsername !== normalize(user.username)) {
        updateData.username = normalize(newUsername);
      }
      if (newEmail !== normalize(user.email)) {
        updateData.email = normalize(user.email);
      }
      if (newPassword) {
        if (!(await comparePassword(newPassword, user.password))) {
          updateData.password = await hashPassword(newPassword);
        }
      }

      const conflictUser = await isEmailOrUsernameTaken(
        updateData.username,
        updateData.email
      );

      if (conflictUser) {
        if (
          conflictUser.username === updateData.username &&
          conflictUser.email === updateData.email
        ) {
          return res
            .status(409)
            .json({ error: "Email and Username already taken" });
        }
        if (conflictUser.username === updateData.username) {
          return res.status(409).json({ error: "Username already taken" });
        }
        if (conflictUser.email === updateData.email) {
          return res.status(409).json({ error: "Email already registered" });
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(200).json({ message: "No change detected" });
      }

      const userUpdate = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      })
        .select("-password")
        .lean();

      return res
        .status(201)
        .json({ message: "User updated succesfully", user: userUpdate });
    } catch (error) {
      console.log(error);
    }
  },
  activateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(409).json({ error: "Id not valid" });
      }

      const user = await User.findById(id);

      if (!user) return res.status(404).json({ error: "User not found" });

      const isActive = user.active;

      if (isActive)
        return res.status(409).json({
          error: "User is active",
        });

      const userUpdate = await User.findByIdAndUpdate(
        id,
        { active: true },
        { new: true }
      )
        .select("-password")
        .lean();

      return res
        .status(200)
        .json({ message: "User successfully activated", user: userUpdate });
    } catch (error) {
      console.log("Error activating user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deactivateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(409).json({ error: "Id not valid" });
      }

      const user = await User.findById(id).select("-password").lean();

      if (!user) return res.status(404).json({ error: "User not found" });

      if (!user.active)
        return res.status(409).json({
          error: "User is deactivate",
        });

      const updateUser = await User.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
      )
        .select("-password")
        .lean();

      return res
        .status(200)
        .json({ message: "User successfully deactivated", user: updateUser });
    } catch (error) {
      console.log("Error deactivating user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
