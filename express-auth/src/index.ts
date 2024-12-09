import express from "express";
import { AppDataSource } from "./data-source";

const app = express();

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    app.listen(3000, () => {
      console.log("Express server has started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
export default app;
