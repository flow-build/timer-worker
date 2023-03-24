import Router from "@koa/router";
import parser from "koa-bodyparser";
import cors from "koa2-cors";
import { addProcessTimer, addUserTaskTimer, scheduleProcessTimer } from "../controllers/queue";
import { healthcheck } from "../controllers/health";
import { routerOptions } from "../utils/types";
import { 
  getJobCounts, 
  getRepeatable, 
  getJob,
  getFailed,
  getDelayed,
  getMetrics,
  listJobs } from "../controllers/getters";

export function freeRouter(options: routerOptions = {}) {
  const router = new Router();
  router.use(parser());
  router.use(cors(options.corsOptions));

  router.get("/", healthcheck);
  router.get("/healthcheck", healthcheck);
  router.get("/jobs", listJobs)
  router.get("/jobs/repeatable", getRepeatable)
  router.get("/jobs/failed", getFailed)
  router.get("/jobs/delayed", getDelayed)
  router.get("/jobs/metrics", getMetrics)
  router.get("/jobs/counts", getJobCounts)
  router.get("/jobs/:id/details", getJob)
  router.post('/jobs/process', addProcessTimer)
  router.post('/jobs/usertask', addUserTaskTimer)
  router.post('/jobs/workflow', scheduleProcessTimer)

  return router;
}
