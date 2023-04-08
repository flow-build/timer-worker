require("dotenv").config();
import { Queue } from "bullmq";
import { logger } from "../utils/logger";
import { connection } from "../utils/db";
import { mapJobOut } from "../utils/mapper";
import { Context } from "koa";

const myQueue = new Queue(process.env.TIMER_QUEUE || "timer", { connection });

export async function getJobCounts(ctx: Context, next: () => Promise<any>) {
  logger.debug("called getJobCounts");
  const counts = await myQueue.getJobCounts("wait", "delayed", "active", "completed", "failed");

  ctx.status = 200;
  ctx.body = counts;
  return next();
}

export async function getRepeatable(ctx: Context, next: () => Promise<any>) {
  logger.debug("called getRepeatable");
  const jobs = await myQueue.getRepeatableJobs(0, 100, true);

  ctx.status = 200;
  ctx.body = jobs;
  return next();
}

export async function getJob(ctx: Context, next: () => Promise<any>) {
  const jobId = ctx.params.id;
  logger.debug(`called getJob id ${jobId}`);
  const job = await myQueue.getJob(jobId);

  if (job) {
    ctx.status = 200;
    ctx.body = {
      job: mapJobOut(job),
    };
  } else {
    ctx.status = 204;
  }

  return next();
}

export async function getFailed(ctx: Context, next: () => Promise<any>) {
  logger.debug("called getFailed");
  const jobs = await myQueue.getFailed(0, 100);

  ctx.status = 200;
  ctx.body = jobs.map((job) => mapJobOut(job));
  return next();
}

export async function getDelayed(ctx: Context, next: () => Promise<any>) {
  logger.debug("called getDelayed");
  const jobs = await myQueue.getDelayed(0, 100);

  ctx.status = 200;
  ctx.body = {
    jobs,
  };
  return next();
}

export async function getMetrics(ctx: Context, next: () => Promise<any>) {
  logger.debug("called getMetrics");
  const jobs = await myQueue.getMetrics("completed", 0, 100);

  ctx.status = 200;
  ctx.body = {
    jobs,
  };
  return next();
}

export async function listJobs(ctx: Context, next: () => Promise<any>) {
  logger.debug("called listJobs");
  const jobs = await myQueue.getJobs(["completed", "failed"], 0, 100, true);

  ctx.status = 200;
  ctx.body = jobs.map((job) => mapJobOut(job));
  return next();
}
