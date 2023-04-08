import { initQueue, addJob, removeJob } from "../services/queue";

test("initQueue", async () => {
  const queue = await initQueue();
  expect(queue).toBeDefined();
});

test("addJob", async () => {
  const job = await addJob({
    name: "test",
    payload: {
      id: "test",
    },
  });
  expect(job).toBeDefined();
});

test("removeJob", async () => {
  const job = await addJob({
    name: "test",
    payload: {
      id: "test",
    },
  });
  let removedJob;
  if (job.id) {
    removedJob = await removeJob(job.id);
  }
  expect(removedJob).toBeDefined();
});

test("removeJob should return NOT FOUND", async () => {
  const removedJob = await removeJob('1');
  expect(removedJob).toBeUndefined();
});