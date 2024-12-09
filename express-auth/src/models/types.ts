export enum Role {
  Admin = "Admin",
  User = "User",
  Manager = "Manager",
}

export interface AccessRefreshTokenPayload {
  userId: string;
  type: "access" | "refresh";
}
