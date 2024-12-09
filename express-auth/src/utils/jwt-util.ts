import * as crypto from "crypto";
import jwt from "jsonwebtoken";

export function generateJWT(
  payload: Record<string, any>,
  secret: string,
  expiresIn: string
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJWT(
  token: string,
  secret: string
): Record<string, any> | null {
  try {
    return jwt.verify(token, secret) as Record<string, any>;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
