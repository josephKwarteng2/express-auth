import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export function generateJWT(
  payload: JWTPayload,
  secret: string,
  expiresIn: string
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
