import fastfy from "fastify";
import cookie from "@fastify/cookie";
import { transactionRoutes } from "./routes/transactions";

export const app = fastfy();

app.register(cookie);

app.addHook("preHandler", async (req, reply) => {
  console.log(`[${req.method}] ${req.url}`);
});

app.register(transactionRoutes, {
  prefix: "transactions",
});
