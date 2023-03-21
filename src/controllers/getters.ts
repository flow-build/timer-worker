import { Queue } from "bullmq";
import { connection } from "../utils/db";

const myQueue = new Queue("timer", { connection });

export async function listJobs(ctx: any, next: () => Promise<any>) {
  console.log("called listJobs");
  const counts = await myQueue.getJobCounts("wait", "waiting-children", "delayed", "active", "completed", "failed");

  ctx.status = 200;
  ctx.body = {
    counts,
  };
  return next();
}

export async function listJobsDetailed(ctx: any, next: () => Promise<any>) {
  console.log("called listJobsDetailed");
  const jobs = await myQueue.getJobs(["delayed"], 0, 100, true);

  ctx.status = 200;
  ctx.body = {
    timestamp: new Date(jobs[0].timestamp),
    jobs,
  };
  return next();
}

export async function getPendingJobs(ctx: any, next: () => Promise<any>) {
  console.log("called getPendingJobs");
  const jobs = await myQueue.getJobs(["wait", "waiting-children", "active", "delayed"], 0, 100, true);

  ctx.status = 200;
  ctx.body = {
    jobs,
  };
  return next();
}