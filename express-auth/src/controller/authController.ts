import { Request, Response, NextFunction } from "express";
import { LoginUserDTO, RegisterUserDTO } from "../dto/UserDTO";
import { UserService } from "../service/UserService";
import { catchAsync } from "../utils/errorHandler";
import { validateDto } from "../middlewares/validate";

export class AuthController {
  private userService: UserService;

  constructor() {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
    this.userService = new UserService(accessTokenSecret, refreshTokenSecret);
  }

  createUserLoginValidation = validateDto(LoginUserDTO);
  createUserRegistrationValidation = validateDto(RegisterUserDTO);

  userRegistration = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const userData: RegisterUserDTO = req.body;
      const user = await this.userService.register(userData);

      const { user: userWithoutPassword, token } = await this.userService.login(
        {
          email: userData.email,
          password: userData.password,
        }
      );

      res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  );

  userLogin = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const loginData: LoginUserDTO = req.body;
      const { user, token } = await this.userService.login(loginData);

      res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );

  //   getProfile = catchAsync(
  //     async (
  //       req: Request,
  //       res: Response,
  //       next: NextFunction
  //     ): Promise<Response | void> => {
  //       if (!req.user) {
  //         return res.status(401).json({ message: "Unauthorized" });
  //       }

  //       const user = await this.userService.getUserById(req.user.id);

  //       if (!user) {
  //         return res.status(404).json({ message: "User not found" });
  //       }

  //       return res.json(user);
  //     }
  //   );
}

export default new AuthController();
