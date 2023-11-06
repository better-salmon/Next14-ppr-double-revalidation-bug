import Fastify from "fastify";
import { pino } from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
  level: process.env.CI ? "silent" : "info",
});

const host = process.env.HOST ?? "localhost";
const port = Number.parseInt(process.env.PORT ?? "8081", 10);

function createCounter() {
  return [0, Date.now()];
}

const pathMeta = new Map();

const server = Fastify();

server.addHook("preHandler", (request, _reply, done) => {
  let meta = pathMeta.get(request.url);

  if (!meta) {
    meta = createCounter();
    pathMeta.set(request.url, meta);
  }

  const [, lastRequestTime] = meta;

  const requestTime = Date.now();

  logger.info("%s delay %d", request.url, requestTime - lastRequestTime);

  meta[0] += 1;
  meta[1] = requestTime;

  done();
});

server.get("/count", async (request, reply) => {
  const meta = pathMeta.get(request.url);

  if (!meta) {
    throw new Error("meta not found");
  }

  const [count] = meta;

  const result = { count, unixTimeMs: Date.now() };

  await reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(result);
});

server
  .listen({ port, host })
  .then((address) => {
    logger.info(`backend listening on %s`, address);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
