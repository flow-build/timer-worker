import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

async function getToken() {
  console.log("flowbuild, getToken");
  const baseData = {
    actor_id: "bea79946-bb82-45a9-a446-c9635ad88f0e",
    claims: ["timer"],
  };
  const response = await axios({
    method: "post",
    url: "/token",
    data: baseData,
  });
  axios.defaults.headers.common["Authorization"] = response.data.jwtToken;
  return response.data.jwtToken
}

export async function expireActivityManager(id: string, data: {}) {
  console.log("flowbuild, expireActivityManager", id);
  const token = await getToken();
  const response = await axios({
    method: "post",
    url: `/cockpit/activities/${id}/expire`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  console.log("flowbuild, expireActivityManager", response.data);
  return response;
}

export async function expireProcess(id: string, data: {}) {
  console.log("flowbuild, expireProcess", id);
  const token = await getToken();
  const response = await axios({
    method: "post",
    url: `/cockpit/processes/${id}/expire`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  console.log("flowbuild, expireProcess", response.data);
  return response;
}

export async function expireTimer(id: string, data: {}) {
  console.log("flowbuild, expireTimer", id);
  const token = await getToken();
  const response = await axios({
    method: "post",
    url: `/processes/${id}/continue`,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  console.log("flowbuild, expireTimer", response.data);
  return response;
}

export async function startProcess(id: string, data: {}) {
  console.log("flowbuild, startProcess", id);
  await getToken();
  await axios.post("/workflows/:id/create");

  const response = await axios.post("/processes/:id/run", data);
  console.log("flowbuild, expireActivityManager", response.data);
  return response;
}
