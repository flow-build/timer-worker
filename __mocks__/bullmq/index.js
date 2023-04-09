class Queue {
  constructor(queue) {
    return queue;
  }

  async add(a) { 
    return new Job({
      id: "b8a3990f-39ac-41b6-a0f5-971f3156521e",
      name: a.name,
      delay: 1000,
      data: {
        timerId: "ee6b1d5c-97da-4ac8-84e6-fdc6d58c3606",
      },
    });
  }

  async getJob(id) {
    if (id === "1") {
      return undefined;
    }

    return new Job ({
      id: id,
    });
  }
}

class Job {
  constructor(job) {
    this.id = job.id;
    this.name = job.name;
    this.delay = job.delay;
    this.data = job.data;
    return this
  }

  async remove() {
    return true;
  }
}

module.exports = {
  Queue,
  Job
};
