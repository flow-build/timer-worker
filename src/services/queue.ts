import { Queue } from "bullmq";
import { connection } from "../utils/db";

const queueName = process.env.TIMER_QUEUE ? process.env.TIMER_QUEUE : "timer"
const myQueue = new Queue(queueName, { connection });

export async function addJob(job: { name: string; payload: any; options?: any }) {
  const myJob = await myQueue.add(job.name, job.payload, job.options);
  console.log(`job ${job.name} added, id ${myJob.id}`);
  return myJob
}

