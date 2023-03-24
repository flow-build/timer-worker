import * as Koa from "koa";

export async function healthcheck(ctx: Koa.Context, next: () => Promise<any>) {
  console.log("called healthcheck");
  ctx.status = 200;
  ctx.body = {
    message: "Timer Worker is fine!",
    FS: process.env.FLOWBUILD_URL
  };
  return next();
}
