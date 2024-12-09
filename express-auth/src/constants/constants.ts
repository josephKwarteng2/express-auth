export const FIELD_VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  ROLES: ["Admin", "Manager", "User"],
  INVALID_ROLE: "Role must either be admin, manager or user.",
  NAME_STRING: "Name must be a string.",
  PASSWORD_LENGTH_ERROR: "Password must be at least 6 characters long.",
  NAME_REQUIRED: "Name field cannot be empty",
  EMPTY_EMAIL_FIELD: "Email field cannot be empty",
  EMPTY_PASSWORD_FIELD: "Password field cannot be empty",
  EMAIL_FORMAT: "Invalid email format",
  EMAIL_MAX_LENGTH: "Email cannot be longer than 100 characters",
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Email or password invalid",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
};
