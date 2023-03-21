import { addJob } from "../services/queue";

interface Ijob {
  name: string;
  payload: any;
  options: any;
}

export async function addJobToQueue(ctx: any, next: () => Promise<any>) {
  console.log("called healthcheck");
  const job: Ijob = ctx.request.body;

  addJob({
    name: job.name,
    payload: job.payload,
    options: job.options,
  });

  ctx.status = 200;
  ctx.body = {
    message: "job Added",
  };
  return next();
}

export async function timerNode(ctx: any, next: () => Promise<any>) {
  console.log("called healthcheck");
    
  const body = ctx.request.body;
  console.log(body)
  
  ctx.status = 200;
  ctx.body = {
    message: "job Added",
  };
  return next();
}