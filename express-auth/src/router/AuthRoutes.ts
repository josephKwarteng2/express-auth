import { Router } from "express";
import { AuthController } from "../controller/authController";

const authRoute = Router();
const authController = new AuthController();

authRoute.post(
  "/register",
  authController.createUserRegistrationValidation,
  authController.userRegistration
);

authRoute.post(
  "/login",
  authController.createUserLoginValidation,
  authController.userLogin
);

export default authRoute;
