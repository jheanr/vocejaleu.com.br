import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPAge, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPAge() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) {
        throw Error();
      }
    }
  }
}

export default {
  waitForAllServices,
};
