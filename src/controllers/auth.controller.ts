import { comparePassword } from "@/helpers/user.helpers";
import { User } from "@/schemas/mongo/user.schema";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/tokenGenerator";
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
      const accessToken = generateAccessToken(user);
      const token = generateRefreshToken();

      //guardar token en base de datos
      
      // const saveRefreshToken = await User.findByIdAndUpdate(
      //   user.id,
      //   { refreshToken: token },
      //   { new: true }
      // );

      //respuesta al cliente
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        refreshToken: user.refreshToken,
      };
      return res.status(200).json({
        message: "User authenticate succesfully",
        user: userResponse,
        token: accessToken,
      });
    } catch (error) {
      console.log(error);
    }
  },
  refreshToken: (req: Request, res: Response) => {},
  logoutUser: () => {},
};
