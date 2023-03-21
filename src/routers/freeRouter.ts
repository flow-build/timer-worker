import Router from "@koa/router";
import parser from "koa-bodyparser";
import cors from "koa2-cors";
import { addJobToQueue, timerNode } from "../controllers/queue";
import { healthcheck } from "../controllers/health";
import { routerOptions } from "../utils/types";
import { listJobs, listJobsDetailed } from "../controllers/getters";

export function freeRouter(options: routerOptions = {}) {
  const router = new Router();
  router.use(parser());
  router.use(cors(options.corsOptions));

  router.get("/", healthcheck);
  router.get("/healthcheck", healthcheck);
  router.get("/jobs", listJobs)
  router.get("/jobs/details", listJobsDetailed)
  router.post('/jobs', addJobToQueue)
  router.post('/job1', timerNode)

  return router;
}
