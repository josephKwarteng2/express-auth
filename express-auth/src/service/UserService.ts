import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Role } from "../models/types";
import UserRepository from "../repository/UserRepository";
import { LoginUserDTO, RegisterUserDTO } from "../dto/UserDTO";
import { User } from "../entity/User";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/constants";
import { sendVerificationEmail } from "../utils/email";

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(accessTokenSecret: string, refreshTokenSecret: string) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
    this.userRepository = new UserRepository();
  }

  async register(userData: RegisterUserDTO, role: Role): Promise<User> {
    if (![Role.User, Role.Manager].includes(role)) {
      throw new Error(ERROR_MESSAGES.INVALID_ROLE);
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const user = await this.userRepository.createUser({
      ...userData,
      role,
    });

    await sendVerificationEmail(user.email);

    return user;
  }

  async verifyEmail(verificationToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(
        verificationToken,
        process.env.EMAIL_SECRET_KEY || ""
      ) as { email: string };
      const user = await this.userRepository.findByEmail(decoded.email);

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      user.verified = true;
      await this.userRepository.save(user);

      return SUCCESS_MESSAGES.EMAIL_VERIFIED;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error(ERROR_MESSAGES.EXPIRED_VERIFICATION_TOKEN);
      }
      throw new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }
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

    if (!user.verified) {
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      this.accessTokenSecret,
      { expiresIn: "15m" }
    );

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne(userId);
    return user || null;
  }
}

export default new UserService(
  process.env.ACCESS_TOKEN_SECRET || "",
  process.env.REFRESH_TOKEN_SECRET || ""
);
