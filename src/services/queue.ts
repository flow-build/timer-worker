import { Queue } from "bullmq";
import { logger } from "../utils/logger";
import { connection } from "../utils/db";

const queueName = process.env.TIMER_QUEUE ? process.env.TIMER_QUEUE : "timer";
let myQueue: Queue;

export function initQueue() {
  myQueue = new Queue(queueName, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  });
  return myQueue;
}

export async function addJob(job: { name: string; payload: any; options?: any }) {
  logger.debug(`called addjob name ${job.name}`);
  if (!myQueue) {
    initQueue();
  }
  const myJob = await myQueue.add(job.name, job.payload, job.options);
  logger.silly(`job ${job.name} added, id ${myJob.id}`);
  return myJob;
}

export async function removeJob(id: string) {
  logger.debug(`called removeJob id ${id}`);
  if (!myQueue) {
    initQueue();
  }
  const job = await myQueue.getJob(id);
  if (!job) {
    logger.debug(`job id ${id} NOT FOUND`);
    return undefined;
  }
  logger.silly(`job id ${id} FOUND, removing`);
  await job.remove();
  logger.debug(`job id ${id} REMOVED`);
  return job;
}
