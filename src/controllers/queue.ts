import { addJob } from "../services/queue";
import { toSeconds, parse } from "iso8601-duration";
import { mapJobOut } from "./utils/mapper";

interface Ischedule {
  id: string;
  interval?: string;
  limit?: number;
  pattern?: string
}

interface Itimer {
  id: string,
  duration: string
}

function convertDurationToMs(duration:string):number {
  return toSeconds(parse(duration))*1000;
}

export async function addProcessTimer(ctx: any, next: () => Promise<any>) {
  console.log("called addProcessTimer");
  const timer: Itimer = ctx.request.body;

  const response = await addJob({
    name: "process",
    payload: {
      resourceId: timer.id,
      resourceType: "process"
    },
    options: {
      delay: convertDurationToMs(timer.duration)
    },
  });

  ctx.status = 200;
  ctx.body = {
    message: "job added",
    job: mapJobOut(response)
  };
  return next();
}

export async function addUserTaskTimer(ctx: any, next: () => Promise<any>) {
  console.log("called addUserTaskTimer");
  const timer: Itimer = ctx.request.body;

  const response = await addJob({
    name: "usertask",
    payload: {
      resourceId: timer.id,
      resourceType: "activityManager"
    },
    options: {
      delay: convertDurationToMs(timer.duration)
    },
  });

  ctx.status = 200;
  ctx.body = {
    message: "job added",
    job: mapJobOut(response)
  };
  return next();
}

export async function scheduleProcessTimer(ctx: any, next: () => Promise<any>) {
  console.log("called addJobToQueue");
  const timer: Ischedule = ctx.request.body;

  if(timer.pattern && timer.interval) {
    ctx.status = 400;
    ctx.body = {
      message: "you cannot define pattern AND interval"
    }

    return next()
  }

  const response = await addJob({
    name: "workflow",
    payload: {
      resourceId: timer.id,
      resourceType: "workflow"
    },
    options: {
      repeat: {
        every: timer.interval ? convertDurationToMs(timer.interval) : undefined,
        pattern: timer.pattern ? timer.pattern : undefined,
        limit: timer.limit,
      }
    },
  });

  ctx.status = 200;
  ctx.body = {
    message: "job added",
    job: response
  };
  return next();
}