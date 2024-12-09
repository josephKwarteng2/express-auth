import * as bcrypt from "bcrypt";
import { Role } from "../models/types";
import UserRepository from "../repository/UserRepository";
import { LoginUserDTO, RegisterUserDTO } from "../dto/UserDTO";
import { User } from "../entity/User";
import { generateJWT, verifyJWT } from "../utils/jwt-util";
import { ERROR_MESSAGES } from "../constants/constants";

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(accessTokenSecret: string, refreshTokenSecret: string) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;

    this.userRepository = new UserRepository();
  }

  async register(userData: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const userRole = userData.role || Role.User;
    const user = await this.userRepository.createUser({
      ...userData,
      role: userRole,
    });

    return user;
  }

  async login(
    loginData: LoginUserDTO
  ): Promise<{ user: Partial<User>; token: string }> {
    const user = await this.userRepository.findByEmail(loginData.email);

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = generateJWT(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      this.accessTokenSecret,
      "15m"
    );

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = verifyJWT(token, this.accessTokenSecret);
      if (!payload) {
        throw new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
      }
      const user = await this.getUserById(payload.id);
      return user || null;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne(userId);
    return user || undefined;
  }
}

export default new UserService(
  process.env.ACCESS_TOKEN_SECRET || "",
  process.env.REFRESH_TOKEN_SECRET || ""
);
