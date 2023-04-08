import Koa from "koa";
import { freeRouter } from "./routers/freeRouter";
import { initQueue } from "./services/queue";
import { worker } from "./services/worker";
import { logger } from "./utils/logger";

export function startServer(config: any) {
  const app = new Koa();
  initQueue();

  const _worker = worker;
  if(_worker) {
    logger.info('Worker initialized')
  }

  app.use(freeRouter({corsOptions: config.cors.options}).routes())

  return app.listen(config.port, () => {
    logger.info(`Timer Worker Running on port ${config.port}...`);
  });
}
