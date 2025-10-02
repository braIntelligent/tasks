import {
  comparePassword,
  generateToken,
  normalize,
} from "@/helpers/user.helpers";
import { IUser } from "@/interfaces/user.interface";
import { User } from "@/schemas/mongo/user.schema";
import { Request, Response } from "express";

export const authController = {
  loginUser: async (req: Request, res: Response) => {
    try {
      //hay body?
      const { usernameOrEmail, password } = req.body;

      //existe el usuario y esta activo?
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      }).lean();
      if (!user || !user.active) {
        return res.status(404).json({ message: "User not found" });
      }

      //las credenciales son veridicas
      const isSamePassword = await comparePassword(password, user.password);
      if (!isSamePassword) {
        return res.status(403).json({
          message: "Password is not correct",
        });
      }

      //genero token del usuario
      const token = generateToken(user);

      //respuesta al cliente
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      return res.status(200).json({
        message: "User authenticate succesfully",
        user: userResponse,
        token,
      });
    } catch (error) {
      console.log(error);
    }
  },
  refreshUser: () => {},
  logoutUser: () => {},
};
