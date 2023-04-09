import { Context } from "koa";
import { addJob, removeJob } from "../services/queue";
import { toSeconds, parse } from "iso8601-duration";
import { mapJobOut } from "../utils/mapper";
import { logger } from "../utils/logger";

interface Ischedule {
  id: string;
  interval?: string;
  limit?: number;
  pattern?: string;
}

interface Itimer {
  id: string;
  duration: string
}

function convertDurationToMs(duration: string): number {
  return toSeconds(parse(duration)) * 1000;
}

function mapTimerIn(body:any): Itimer {
  return {
    id: body.id,
    duration: body.duration,
  }
}

function mapScheduleIn(body:any): Ischedule {
  return {
    id: body.id,
    interval: body.interval,
    limit: body.limit,
    pattern: body.pattern
  }
}

export async function addProcessTimer(ctx: Context, next: () => Promise<any>) {
  logger.verbose("called addProcessTimer");
  const timer: Itimer = mapTimerIn(ctx.request.body);

  const _job = await addJob({
    name: "process",
    payload: {
      resourceId: timer.id,
      resourceType: "process",
    },
    options: {
      delay: convertDurationToMs(timer.duration),
    },
  });

  ctx.status = 200;
  ctx.body = {
    job: mapJobOut(_job),
  };
  return next();
}

export async function addUserTaskTimer(ctx: Context, next: () => Promise<any>) {
  logger.verbose("called addUserTaskTimer");
  const timer: Itimer = mapTimerIn(ctx.request.body);

  const _job = await addJob({
    name: "usertask",
    payload: {
      resourceId: timer.id,
      resourceType: "activityManager",
    },
    options: {
      delay: convertDurationToMs(timer.duration),
    },
  });

  ctx.status = 200;
  ctx.body = {
    job: mapJobOut(_job),
  };
  return next();
}

export async function scheduleProcessTimer(ctx: Context, next: () => Promise<any>) {
  logger.verbose("called addJobToQueue");
  const schedule: Ischedule = mapScheduleIn(ctx.request.body);

  if (schedule.pattern && schedule.interval) {
    logger.debug("schedule refused, conflict of pattern and interval");
    ctx.status = 400;
    ctx.body = {
      message: "you cannot define pattern AND interval",
    };

    return next();
  }

  const _job = await addJob({
    name: "workflow",
    payload: {
      resourceId: schedule.id,
      resourceType: "workflow",
    },
    options: {
      repeat: {
        every: schedule.interval ? convertDurationToMs(schedule.interval) : undefined,
        pattern: schedule.pattern ? schedule.pattern : undefined,
        limit: schedule.limit,
      },
    },
  });

  ctx.status = 200;
  ctx.body = {
    job: _job,
  };
  return next();
}

export async function deleteJob(ctx: Context, next: () => Promise<any>) {
  logger.verbose("called removeJob");
  const jobId = ctx.params.id;
  const _job = await removeJob(jobId);
  if (!_job) {
    ctx.status = 404;
    ctx.body = {
      message: "job not found",
    };
    return next();
  }
  ctx.status = 200;
  ctx.body = {
    message: "job deleted",
    job: _job,
  };
  return next();
}
