import { Router } from "express";
import { AuthController } from "../controller/authController";

const authRoute = Router();
const authController = new AuthController();

authRoute.post(
  "/staff/register",
  authController.createUserRegistrationValidation,
  authController.userRegistration
);
authRoute.post(
  "/manager/register",
  authController.createUserRegistrationValidation,
  authController.userRegistration
);

authRoute.post(
  "/login",
  authController.createUserLoginValidation,
  authController.userLogin
);

authRoute.get("/verify-email/:token", authController.emailVerification);

export default authRoute;
