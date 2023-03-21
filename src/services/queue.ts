import { Queue } from "bullmq";
import { connection } from "../utils/db";

const myQueue = new Queue("foo", { connection });

export async function addJob(job: { name: string; payload: any; options?: any }) {
  await myQueue.add(job.name, job.payload, job.options);
  console.log(`job ${job.name} added`);
}

