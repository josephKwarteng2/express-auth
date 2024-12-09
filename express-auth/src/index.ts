import express from "express";
import { AppDataSource } from "./data-source";
import bodyParser from "body-parser";
import authRoute from "./router/AuthRoutes";
import { globalErrorHandler } from "./utils/errorHandler";

const app = express();

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    app.listen(3000, () => {
      app.use(bodyParser.json());
      app.use("/api", authRoute);
      app.use(globalErrorHandler);
      console.log("Express server has started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
export default app;
