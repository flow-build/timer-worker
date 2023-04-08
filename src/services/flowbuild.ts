import axios from "axios";
import { logger } from "../utils/logger";

async function getToken() {
  logger.silly("flowbuild getToken");
  const baseData = {
    actor_id: process.env.TIMER_WORKER_ACTOR_ID || "bea79946-bb82-45a9-a446-c9635ad88f0e",
    claims: ["timer"],
  };
  const response = await axios({
    baseURL: process.env.FLOWBUILD_URL ? process.env.FLOWBUILD_URL : "http://localhost:3000",
    method: "post",
    url: "/token",
    data: baseData,
  });
  logger.silly("getToken retrieved");
  return response.data.jwtToken
}

export async function expireActivityManager(id: string, data: {}) {
  logger.debug(`flowbuild expireActivityManager id: ${id}`);
  const token = await getToken();
  const response = await axios({
    method: "post",
    baseURL: process.env.FLOWBUILD_URL ? process.env.FLOWBUILD_URL : "http://localhost:3000",
    url: `/cockpit/activities/${id}/expire`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  logger.debug(`ActivityManager Expired`);
  return response;
}

export async function expireProcess(id: string, data: {}) {
  logger.debug(`flowbuild, expireProcess id: ${id}`);
  const token = await getToken();
  const response = await axios({
    method: "post",
    baseURL: process.env.FLOWBUILD_URL ? process.env.FLOWBUILD_URL : "http://localhost:3000",
    url: `/cockpit/processes/${id}/expire`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  logger.debug(`Process expired`);
  return response;
}

export async function expireTimer(id: string, data: {}) {
  logger.debug(`flowbuild, expireTimer id: ${id}`);
  const token = await getToken();
  const response = await axios({
    method: "post",
    baseURL: process.env.FLOWBUILD_URL ? process.env.FLOWBUILD_URL : "http://localhost:3000",
    url: `/processes/${id}/continue`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  logger.debug(`Timer expired`);
  return response;
}

export async function startProcess(id: string, data: {}) {
  logger.debug(`flowbuild, startProcess workflowId: ${id}`);
  const token = await getToken();
  const myProcess = await axios({
    method: "post",
    baseURL: process.env.FLOWBUILD_URL ? process.env.FLOWBUILD_URL : "http://localhost:3000",
    url: `/workflows/${id}/create`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  logger.debug(`process created, id' ${myProcess.data.process_id}`)
  const response = await axios({
    method: "post",
    baseURL: process.env.FLOWBUILD_URL ? process.env.FLOWBUILD_URL : "http://localhost:3000",
    url: `/processes/${myProcess.data.process_id}/run`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  logger.debug("flowbuild, process started");
  return response;
}
