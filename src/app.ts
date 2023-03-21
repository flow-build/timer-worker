import Koa from "koa";
import { freeRouter } from "./routers/freeRouter";
import { worker } from "./services/worker";

export function startServer(config: any) {
  const app = new Koa();

  const w = worker;
  if(w) {
    console.log('Worker initialized')
  }

  app.use(freeRouter({corsOptions: config.cors.options}).routes())

  return app.listen(config.port, () => {
    console.log(`Timer Worker Running on port ${config.port}...`);
  });
}
