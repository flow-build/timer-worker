import { Queue } from "bullmq";
import { connection } from "../utils/db";
import { mapJobOut } from "./utils/mapper";

const myQueue = new Queue("timer", { connection });

export async function getJobCounts(ctx: any, next: () => Promise<any>) {
  console.log("called getJobCounts");
  const counts = await myQueue.getJobCounts("wait", "delayed", "active", "completed", "failed");

  ctx.status = 200;
  ctx.body = counts;
  return next();
}

export async function getRepeatable(ctx: any, next: () => Promise<any>) {
  console.log("called getRepeatable");
  const jobs = await myQueue.getRepeatableJobs(0, 100, true);

  ctx.status = 200;
  ctx.body = jobs
  return next();
}

export async function getJob(ctx: any, next: () => Promise<any>) {
  const jobId = ctx.params.id;
  console.log(`called getJob id ${jobId}`);
  const job = await myQueue.getJob(jobId);

  if(job) {
    ctx.status = 200;
    ctx.body = {
      job: mapJobOut(job),
    };
  } else {
    ctx.status = 204
  }
  
  return next();
}

export async function getFailed(ctx: any, next: () => Promise<any>) {
  console.log("called getFailed");
  const jobs = await myQueue.getFailed(0, 100);

  ctx.status = 200;
  ctx.body = jobs.map(job => mapJobOut(job))
  return next();
}

export async function getDelayed(ctx: any, next: () => Promise<any>) {
  console.log("called getDelayed");
  const jobs = await myQueue.getDelayed(0, 100);

  ctx.status = 200;
  ctx.body = {
    jobs,
  };
  return next();
}

export async function getMetrics(ctx: any, next: () => Promise<any>) {
  console.log("called getMetrics");
  const jobs = await myQueue.getMetrics("completed", 0, 100);

  ctx.status = 200;
  ctx.body = {
    jobs,
  };
  return next();
}

export async function listJobs(ctx: any, next: () => Promise<any>) {
  console.log("called listJobs");
  const jobs = await myQueue.getJobs(["completed", "failed"], 0, 100, true);

  ctx.status = 200;
  ctx.body = {
    timestamp: new Date(jobs[0].timestamp),
    jobs,
  };
  return next();
}