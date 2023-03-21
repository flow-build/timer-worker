import cors from "koa2-cors";

export interface routerOptions {
  corsOptions?: cors.Options;
}

export interface appConfig {
  port: number;
  cors: {
    options: cors.Options;
  };
}
