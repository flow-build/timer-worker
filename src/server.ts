require("dotenv").config()
import { startServer } from "./app";
import { appConfig } from "./utils/types";

const port = 3001;

const config:appConfig = {
  port,
  cors: {
    options: {
      origin: '*',
      allowMethods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization", "Accept", "x-duration", "x-secret"],
    }
  }
}

startServer(config)