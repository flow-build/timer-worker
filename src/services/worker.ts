require("dotenv").config();
import { Worker } from "bullmq";
import { connection } from "../utils/db";
import { expireActivityManager, expireProcess, expireTimer, startProcess } from "../services/flowbuild";
import { logger } from "../utils/logger";

interface Ijob {
  resourceId: string;
  timerId: string;
}

async function processContinue(data: Ijob): Promise<any> {
  logger.debug(`continueProcess, processId ${data.resourceId}`);
  await expireTimer(data.resourceId, {});
  return data;
}

async function amExpire(data: Ijob): Promise<any> {
  logger.debug(`expireActivityManager, amid ${data.resourceId}`);
  await expireActivityManager(data.resourceId, { timerId: data.timerId });
  return data;
}

async function processExpire(data: Ijob): Promise<any> {
  logger.debug(`processExpire, processId ${data.resourceId}`);
  await expireProcess(data.resourceId, {});
  return data;
}

async function processStart(data: Ijob): Promise<any> {
  logger.debug(`processExpire, workflowId ${data.resourceId}`);
  await startProcess(data.resourceId, {});
  return data;
}

const action: { [key: string]: any } = {
  intermediateevent: processContinue,
  usertask: amExpire,
  process: processExpire,
  workflow: processStart,
};

export const worker = new Worker(
  process.env.TIMER_QUEUE || "timer",
  async (job) => {
    logger.info(`WORKER, processing jobId ${job.id}, type ${job.name}`)
    logger.verbose(`WORKER, resourceId ${job.data.resourceId}`)
    const name = job.name.toLowerCase();
    await action[name](job.data);
    logger.info(`WORKER, jobId ${job.id}, type ${job.name} processed`);
  },
  { connection, concurrency: 5 }
);
