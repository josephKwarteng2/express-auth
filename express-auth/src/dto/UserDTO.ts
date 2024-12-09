import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Role } from "../models/types";
import { FIELD_VALIDATION } from "../constants/constants";

export class RegisterUserDTO {
  @IsNotEmpty({ message: FIELD_VALIDATION.NAME_REQUIRED })
  @IsString()
  name!: string;

  @IsEmail({}, { message: FIELD_VALIDATION.EMAIL_FORMAT })
  @MaxLength(100, { message: FIELD_VALIDATION.EMAIL_MAX_LENGTH })
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: FIELD_VALIDATION.PASSWORD_LENGTH_ERROR })
  password!: string;
}

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: FIELD_VALIDATION.PASSWORD_LENGTH_ERROR })
  password!: string;
}
