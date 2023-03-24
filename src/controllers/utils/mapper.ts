import { Job } from "bullmq";


export function mapJobOut(job:Job) {
  return {
    id: job.id,
    name: job.name,
    data: job.data,
    options: job.opts,
    attempts: job.attemptsMade,
    delay: job.delay,
    createdAt: new Date(job.timestamp).toISOString(),
    processedOn: job.processedOn ? new Date(job.processedOn).toISOString() : undefined,
    finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : undefined,
    failedReason: job.failedReason,
    stacktrace: job.stacktrace
  }
}