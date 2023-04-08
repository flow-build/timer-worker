import { Job } from "bullmq";

export function mapJobOut(job:Job) {
  const interval = job.opts.delay ? job.opts.delay : 0;
  const delay = job.processedOn ? job.processedOn - job.timestamp - interval : undefined
  return {
    id: job.id,
    name: job.name,
    data: job.data,
    options: job.opts,
    attempts: job.attemptsMade,
    delay,
    createdAt: new Date(job.timestamp).toISOString(),
    scheduledTo: new Date(job.timestamp + interval).toISOString(),
    processedOn: job.processedOn ? new Date(job.processedOn).toISOString() : undefined,
    failedReason: job.failedReason,
    stacktrace: job.failedReason ? job.stacktrace : undefined
  }
}