import { Context } from "koa";
import { logger } from "../utils/logger";
import { PACKAGE_VERSION } from "../version";

export async function healthcheck(ctx: Context, next: () => Promise<any>) {
  logger.silly("called healthcheck");
  ctx.status = 200;
  ctx.body = {
    message: "Timer Worker is fine!",
    version: PACKAGE_VERSION,
    FS: process.env.FLOWBUILD_URL,
  };
  return next();
}
