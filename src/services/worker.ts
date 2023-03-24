require("dotenv").config();
import { Worker } from "bullmq";
import { connection } from "../utils/db";
import { expireActivityManager, expireProcess, expireTimer, startProcess } from "../services/flowbuild";

async function processContinue(data: any): Promise<any> {
  console.log("continueProcess", data);
  await expireTimer(data.resourceId, {});
  return data;
}

async function amExpire(data: any): Promise<any> {
  console.log("expireActivityManager", data);
  await expireActivityManager(data.resourceId, { timerId: data.timerId });
  return data;
}

async function processExpire(data: any): Promise<any> {
  console.log("expireProcess", data);
  await expireProcess(data.resourceId, {});
  return data;
}

async function processStart(data: any): Promise<any> {
  console.log("startProcess", data);
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
    console.log("WORKER job id", job.id);
    console.log("WORKER job name", job.name);
    console.log("WORKER job data", job.data);
    const name = job.name.toLowerCase();
    const result = await action[name](job.data);
    console.log(result);
  },
  { connection }
);
