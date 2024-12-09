import { Router } from "express";
import { AuthController } from "../controller/authController";

const authRoute = Router();
const authController = new AuthController();

authRoute.post(
  "/register/user",
  authController.createUserRegistrationValidation,
  authController.userRegistration
);
authRoute.post(
  "/register/manager",
  authController.createUserRegistrationValidation,
  authController.userRegistration
);
authRoute.post(
  "/register/admin",
  authController.createUserRegistrationValidation,
  authController.userRegistration
);

authRoute.post(
  "/login",
  authController.createUserLoginValidation,
  authController.userLogin
);

export default authRoute;
